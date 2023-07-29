// tslint:disable:unified-signatures
import { Inject, Injectable, Injector, Optional, Type } from '@angular/core';
import { Observable, of, Subscription, throwError } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  take
} from 'rxjs/operators';
import { INITIAL_STATE_TOKEN, PlainObject, StateClass } from '@ngxs/store/internals';
import { UpdateState } from './actions/actions';
import { NgxsAction } from './actions/base.action';
import { RangeLocations, SingleLocation } from './common';
import { throwStateNotFoundError } from './configs/messages.config';
import { InternalNgxsExecutionStrategy } from './execution/internal-ngxs-execution-strategy';
import {
  getSelectorMetadata,
  getStoreMetadata,
  MappedStore,
  SelectorMetaDataModel,
  StateClassInternal,
  StateOperations
} from './internal/internals';
import { LifecycleStateManager } from './internal/lifecycle-state-manager';
import { StateFactory } from './internal/state-factory';
import { InternalStateOperations } from './internal/state-operations';
import { getRootSelectorFactory } from './selectors/selector-utils';
import { StateStream } from './internal/state-stream';
import { leaveNgxs } from './operators/leave-ngxs';
import { StateToken } from './state-token/state-token';
import { META_KEY, NgxsConfig } from './symbols';
import { StoreValidators } from './utils/store-validators';
import { getValue, setValue } from './utils/utils';

@Injectable({ providedIn: 'root' })
export class Store {
  /**
   * This is a derived state stream that leaves NGXS execution strategy to emit state changes within the Angular zone,
   * because state is being changed actually within the `<root>` zone, see `InternalDispatcher#dispatchSingle`.
   * All selects would use this stream, and it would call leave only once for any state change across all active selectors.
   */
  private _selectableStateStream = this._stateStream.pipe(
    leaveNgxs(this._internalExecutionStrategy),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    private _stateStream: StateStream,
    private _internalStateOperations: InternalStateOperations,
    private _config: NgxsConfig,
    private _internalExecutionStrategy: InternalNgxsExecutionStrategy,
    private _stateFactory: StateFactory,
    private _injector: Injector,
    @Optional()
    @Inject(INITIAL_STATE_TOKEN)
    initialStateValue: any
  ) {
    this.initStateStream(initialStateValue);
  }

  /**
   * Dispatches event(s).
   */
  dispatch(actionOrActions: any | any[]): Observable<any> {
    return this._internalStateOperations.getRootStateOperations().dispatch(actionOrActions);
  }

  /**
   * Selects a slice of data from the store.
   */
  select<T>(selector: (state: any, ...states: any[]) => T): Observable<T>;
  select<T = any>(selector: string | Type<any>): Observable<T>;
  select<T>(selector: StateToken<T>): Observable<T>;
  select(selector: any): Observable<any> {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return this._selectableStateStream.pipe(
      map(selectorFn),
      catchError((err: Error): Observable<never> | Observable<undefined> => {
        // if error is TypeError we swallow it to prevent usual errors with property access
        const { suppressErrors } = this._config.selectorOptions;

        if (err instanceof TypeError && suppressErrors) {
          return of(undefined);
        }

        // rethrow other errors
        return throwError(err);
      }),
      distinctUntilChanged(),
      leaveNgxs(this._internalExecutionStrategy)
    );
  }

  /**
   * Select one slice of data from the store.
   */

  selectOnce<T>(selector: (state: any, ...states: any[]) => T): Observable<T>;
  selectOnce<T = any>(selector: string | Type<any>): Observable<T>;
  selectOnce<T>(selector: StateToken<T>): Observable<T>;
  selectOnce(selector: any): Observable<any> {
    return this.select(selector).pipe(take(1));
  }

  /**
   * Select a snapshot from the state.
   */
  selectSnapshot<T>(selector: (state: any, ...states: any[]) => T): T;
  selectSnapshot<T = any>(selector: string | Type<any>): T;
  selectSnapshot<T>(selector: StateToken<T>): T;
  selectSnapshot(selector: any): any {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return selectorFn(this._stateStream.getValue());
  }

  /**
   * Allow the user to subscribe to the root of the state
   */
  subscribe(fn?: (value: any) => void): Subscription {
    return this._selectableStateStream
      .pipe(leaveNgxs(this._internalExecutionStrategy))
      .subscribe(fn);
  }

  /**
   * Return the raw value of the state.
   */
  snapshot(): any {
    return this._internalStateOperations.getRootStateOperations().getState();
  }

  /**
   * Reset the state to a specific point in time. This method is useful
   * for plugin's who need to modify the state directly or unit testing.
   */
  reset(state: any) {
    return this._internalStateOperations.getRootStateOperations().setState(state);
  }

  private getStoreBoundSelectorFn(selector: any) {
    const selectorMDModel: SelectorMetaDataModel = getSelectorMetadata(selector);
    const location: SingleLocation | undefined =
      selectorMDModel === undefined ? undefined : selectorMDModel.location;
    const makeSelectorFn = getRootSelectorFactory(selector);
    const runtimeContext = this._stateFactory.getRuntimeSelectorContext(location);
    return makeSelectorFn(runtimeContext);
  }

  private initStateStream(initialStateValue: any): void {
    const value: PlainObject = this._stateStream.value;
    const storeIsEmpty: boolean = !value || Object.keys(value).length === 0;
    if (storeIsEmpty) {
      const defaultStateNotEmpty: boolean = Object.keys(this._config.defaultsState).length > 0;
      const storeValues: PlainObject = defaultStateNotEmpty
        ? { ...this._config.defaultsState, ...initialStateValue }
        : initialStateValue;

      this._stateStream.next(storeValues);
    }
  }

  /**
   * Allows to dispatch action with State Location specified, so we can specifiy on which part of
   * State data tree we want action to work
   */
  dispatchInLocation(
    event: NgxsAction | NgxsAction[],
    location: SingleLocation | RangeLocations
  ): Observable<any> {
    const eventArray = Array.isArray(event) ? [...event] : [event];
    if (location instanceof SingleLocation) {
      return this._internalStateOperations
        .getRootStateOperations()
        .dispatch(
          eventArray.map(eventItem =>
            Object.assign(Object.create(eventItem), { ...eventItem, location })
          )
        );
    }
    const locationsToSend = this._stateFactory.getLocations(
      <RangeLocations>location,
      eventArray
    );
    const eventToSend = locationsToSend
      .map(item =>
        item.events.map(eventItem =>
          Object.assign(Object.create(eventItem), { ...eventItem, location: item.loc })
        )
      )
      .reduce((acc, curr) => [...acc, ...curr], []);
    return this._internalStateOperations.getRootStateOperations().dispatch(eventToSend);
  }

  /**
   * Select a observable slice of store from specified location
   */
  selectInContext<T = any>(selector: any, location: SingleLocation): Observable<T> {
    const selectorMDModel: SelectorMetaDataModel =
      StoreValidators.getValidSelectorMeta(selector);
    const containerClass = selectorMDModel.containerClass;
    const selectorFn = this._stateFactory.getSelectorFromState(
      containerClass,
      selectorMDModel.originalFn,
      location
    );
    return this.select(selectorFn);
  }

  /** Allows to select one slice of data from the store from specified location */
  selectOnceInContext<T = any>(selector: any, filter: SingleLocation): Observable<T> {
    return this.selectInContext<T>(selector, filter).pipe(take(1));
  }

  /**
   * Select a snapshot from the state  from specified location
   */

  selectSnapshotInContext<T = any>(selector: any, location: SingleLocation): T {
    const selectorMDModel: SelectorMetaDataModel =
      StoreValidators.getValidSelectorMeta(selector);
    const containerClass = selectorMDModel.containerClass;
    const selectorFn = this._stateFactory.getSelectorFromState(
      containerClass,
      selectorMDModel.originalFn,
      location
    );
    const selectorFnWrapped = this.getStoreBoundSelectorFn(selectorFn);
    return selectorFnWrapped(this._stateStream.getValue());
  }

  /**
   * like select snapshot but return all states that is specific location
   */
  getChildrenState(location: SingleLocation): { name: string; state: any }[] {
    const parentLevel = location.path.split('.').length;
    const states = this._stateFactory.states
      .filter(p => p.path.startsWith(location.path))
      .filter(p => p.path.split('.').length - 1 === parentLevel)
      .map(p => ({
        name: SingleLocation.getLocation(p.path).getParentName(),
        state: getValue(
          this._internalStateOperations.getRootStateOperations().getState(),
          p.path
        )
      }));
    return states;
  }

  /**
   * like select snapshot but return all one state - children that is specific location
   */
  getChildrenStateByName(location: SingleLocation, childrenName: string): any {
    const result = this.getChildrenState(location).find(item => item.name === childrenName);
    StoreValidators.checkStateExists(result, location.getChildLocation(childrenName).path);
    return this.getChildrenState(location).find(item => item.name === childrenName)!.state;
  }

  /**
   * return all child class from parent class using property childs (static child)
   */
  getChildrenClass(stateClass: StateClassInternal): StateClassInternal[] {
    const stateClasses = [stateClass];
    StoreValidators.checkThatStateClassesHaveBeenDecorated(stateClasses);
    const { children } = getStoreMetadata(stateClass);
    for (const child of children!) {
      stateClasses.push(...this.getChildrenClass(child));
    }
    return stateClasses;
  }

  /**
   * Adds child state with all his children in parent location
   */
  addChildWithinParent(
    parent: StateClassInternal,
    child: StateClassInternal,
    params: { childName?: string; context?: string }
  ): Observable<any> {
    StoreValidators.checkThatStateClassesHaveBeenDecorated([parent]);
    const parentMeta = getStoreMetadata(parent);
    const location = SingleLocation.getLocation(parentMeta.path!);
    return this.addChildInLocalization(child, location, params);
  }

  /**
   * Adds child state with all his children in specific localization
   */
  addChildInLocalization(
    child: StateClassInternal,
    location: SingleLocation,
    params: { childName?: string; context?: string }
  ): Observable<any> {
    const lifecycle: LifecycleStateManager = this._injector.get(LifecycleStateManager);
    const stateOperations = this._internalStateOperations.getRootStateOperations();
    StoreValidators.checkThatStateClassesHaveBeenDecorated([child]);
    const childMeta = getStoreMetadata(child);
    const mappedStores: MappedStore[] = [];
    params.childName = !params.childName
      ? (params.childName = childMeta.name!)
      : params.childName;
    params.context = !params.context ? (params.context = '') : params.context;
    mappedStores.push(
      ...this.addChildInternal(child, params.childName, stateOperations, location, {
        context: params.context
      })
    );
    return lifecycle.prepareNewStates(mappedStores);
  }

  /**
   * Removes State from State data tree and MappedStores in given location with all its children
   */
  removeChildInLocalization(location: SingleLocation): Observable<any> {
    const lifecycle: LifecycleStateManager = this._injector.get(LifecycleStateManager);
    return of(true).pipe(
      switchMap(() => {
        const mappedStore: MappedStore[] = this._stateFactory.states
          .filter(s => s.path.startsWith(location.path))
          .sort((first, second) => second.path.length - first.path.length);
        return lifecycle.prepareDeleteStates(mappedStore);
      }),
      map(() => {
        const stateOperations = this._internalStateOperations.getRootStateOperations();
        const cur = stateOperations.getState();
        const newState = this._stateFactory.removeChild(cur, location);
        stateOperations.setState({ ...newState });
        return stateOperations;
      }),
      switchMap(stateOperations => stateOperations.dispatch(new UpdateState()))
    );
  }

  /**
   * Removes child state from State data tree and MappedStores in given location with all its children
   */
  removeChild(child: StateClassInternal): Observable<any> {
    return this.removeChildInLocalization(this.getStateLocationByStateClass(child));
  }

  /**
   * Searches for state with given name added in root path and returns that state exist
   */
  existStateLocation(root: SingleLocation): boolean {
    const state = this._stateFactory.states.find(p => p.path === root.path);
    return state !== undefined;
  }

  /**
   * Searches for state with given name added in root path and returns mappedStates info
   */
  getMappedStateInLocation(root: SingleLocation): MappedStore | undefined {
    return this._stateFactory.states.find(p => p.path === root.path);
  }

  /**
   * Searches for state with given name added in root path and returns path to that state
   */
  getStateLocationInPath(root: SingleLocation, stateName: string): SingleLocation {
    const state = this._stateFactory.states.find(
      p => p.path.startsWith(root.path) && p.name === stateName
    );
    if (!state) throwStateNotFoundError(stateName);
    return SingleLocation.getLocation(state!.path);
  }

  /**
   * get location form state class
   */
  getStateLocationByStateClass(stateClass: StateClassInternal): SingleLocation {
    StoreValidators.checkThatStateClassesHaveBeenDecorated([stateClass]);
    const stateMetaData = getStoreMetadata(stateClass);
    return SingleLocation.getLocation(stateMetaData.path!);
  }

  /**
   * get location of given state (recursively searches the state tree by comparing objects)
   */
  getLocationByState(state: any): SingleLocation {
    function findObject(obj: Record<string, any>, path: string): string {
      for (const key of Object.keys(obj)) {
        if (typeof (<any>obj)[key] !== 'object') continue;
        if ((<any>obj)[key] === state) return path === '' ? key : `${path}.${key}`;
        const result = findObject((<any>obj)[key], path === '' ? key : `${path}.${key}`);
        if (result !== '') return result;
      }
      return '';
    }

    const currState = this._internalStateOperations.getRootStateOperations().getState();
    const s = findObject(currState, '');
    if (s === '') throw new Error(`State ${state} doesn't exist in store`);
    return SingleLocation.getLocation(s);
  }

  private addChildInternal(
    child: StateClassInternal,
    childName: string,
    stateOperations: StateOperations<StateClass>,
    location: SingleLocation,
    params: { context: string }
  ): MappedStore[] {
    StoreValidators.checkThatStateClassesHaveBeenDecorated([child]);
    const storeMetaData = getStoreMetadata(child);
    const currentState = stateOperations.getState();
    const mappedStores: MappedStore[] = [];
    const path = `${location.path}.${childName}`;

    const childState = this._stateFactory.addChild(child, childName, location, params);
    mappedStores.push(...childState);
    childState.forEach(childItem => {
      const newState = setValue(currentState, path, childItem.defaults);
      stateOperations.setState(newState);
    });

    const { children } = storeMetaData;
    // if state has set children[] states, children of child, also need to be initiated
    if (children)
      children.forEach((item: any) =>
        mappedStores.push(
          ...this.addChildInternal(
            item,
            item[META_KEY].name,
            stateOperations,
            SingleLocation.getLocation(path),
            params
          )
        )
      );

    return mappedStores;
  }
}
