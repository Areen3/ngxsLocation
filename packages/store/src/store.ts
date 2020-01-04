// tslint:disable:unified-signatures
import { Inject, Injectable, Optional, Type, isDevMode, Injector } from '@angular/core';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import {
  INITIAL_STATE_TOKEN,
  PlainObject,
  StateClass,
  PlainObjectOf
} from '@ngxs/store/internals';

import { InternalNgxsExecutionStrategy } from './execution/internal-ngxs-execution-strategy';
import { InternalStateOperations } from './internal/state-operations';
import { createSelector, getRootSelectorFactory } from './utils/selector-utils';
import { StateStream } from './internal/state-stream';
import { leaveNgxs } from './operators/leave-ngxs';
import { NgxsConfig, META_KEY } from './symbols';
import { StateToken } from './state-token/state-token';
import { StateFactory } from './internal/state-factory';
import { NgxsAction } from './actions/base.action';
import { SelectLocation } from './common/selectLocation';
import {
  propGetter,
  isObject,
  StateClassInternal,
  MappedStore,
  StateOperations,
  SelectorMetaDataModel
} from './internal/internals';
import { LifecycleStateManager } from './internal/lifecycle-state-manager';
import { ActionHandlerMetaData } from './actions/symbols';
import { getValue, setValue } from './utils/utils';
import { UpdateState } from './actions/actions';
@Injectable()
export class Store {
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
  dispatch(event: any | any[]): Observable<any> {
    return this._internalStateOperations.getRootStateOperations().dispatch(event);
  }

  /**
   * Selects a slice of data from the store.
   */
  select<T>(selector: (state: any, ...states: any[]) => T): Observable<T>;
  select<T = any>(selector: string | Type<any>): Observable<T>;
  select<T>(selector: StateToken<T>): Observable<T>;
  select(selector: any): Observable<any> {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return this._stateStream.pipe(
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
    return this._stateStream.pipe(leaveNgxs(this._internalExecutionStrategy)).subscribe(fn);
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

  private getStoreBoundSelectorFn(selector: any, location?: SelectLocation) {
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
    location: SelectLocation
  ): Observable<any> {
    (Array.isArray(event) ? [...event] : [event]).forEach(evnt => (evnt.location = location));
    return this._internalStateOperations.getRootStateOperations().dispatch(event);
  }

  /** Allows to select slice of data from the store from specified location */
  selectInContext<T>(
    selector: (state: any, ...states: any[]) => T,
    filter: SelectLocation
  ): Observable<T>;
  selectInContext(selector: string | any, filter: SelectLocation): Observable<any>;
  selectInContext(selector: any, filter: SelectLocation): Observable<any> {
    const loc = typeof selector === 'string' ? SelectLocation.filterByPath(selector) : filter;
    const selectorFn = createSelector([], selector, {
      containerClass: undefined,
      selectorName: '',
      localization: loc
    });
    return this.select(selectorFn);
  }
  /** Allows to select one slice of data from the store from specified location */
  selectOnceInContext<T>(
    selector: (state: any, ...states: any[]) => T,
    filter: SelectLocation
  ): Observable<T>;
  selectOnceInContext(selector: string | any, filter: SelectLocation): Observable<any>;
  selectOnceInContext(selector: any, filter: SelectLocation): Observable<any> {
    return this.selectInContext(selector, filter).pipe(take(1));
  }

  /**
   * Select a snapshot from the state  from specified location
   */
  selectSnapshotInContext<T>(
    selector: (state: any, ...states: any[]) => T,
    filter: SelectLocation
  ): T;
  selectSnapshotInContext(selector: string | any, location: SelectLocation): any;
  selectSnapshotInContext(selector: any, location: SelectLocation): any {
    const selectorFn = this.getStoreBoundSelectorFn(selector, location);
    return selectorFn(this._stateStream.getValue());
  }

  getChildrenState(location: SelectLocation): any[] {
    const parentLevel = location.path.split('.').length;
    const states = this._stateFactory.states
      .filter(p => p.path.startsWith(location.path))
      .filter(p => p.path.split('.').length - 1 === parentLevel)
      .map(item =>
        getValue(this._internalStateOperations.getRootStateOperations().getState(), item.path)
      );
    return states;
  }
  getChildrenClass(stateClass: StateClassInternal): StateClassInternal[] {
    const stateClasses = [stateClass];
    const { children } = stateClass[META_KEY]!;
    // return children.map(child => [...this.getChildren(child)]).reduce((acc, curr) => [...acc, ...curr], []);
    for (const child of children!) {
      stateClasses.push(...this.getChildrenClass(child));
    }
    return stateClasses;
  }

  /**
   * Adds child state with all of its children
   * @param parent Parent state
   * @param child Child state
   */
  addChildWithinParen(
    parent: StateClassInternal,
    child: StateClassInternal,
    params: { childName?: string; parentName?: string; context?: string }
  ) {
    const stateOperations = this._internalStateOperations.getRootStateOperations();
    const mappedStores: MappedStore[] = [];
    params.parentName = !params.parentName ? parent[META_KEY]!.name! : params.parentName;
    params.childName = !params.childName
      ? (params.childName = child[META_KEY]!.name!)
      : params.childName;
    params.context = !params.context ? (params.context = '') : params.context;
    const loc = SelectLocation.filterByPath(params.parentName);

    mappedStores.push(
      ...this.addChildInternal(child, params.childName, stateOperations, loc, {
        context: params.context
      })
    );
    const lc = this._injector.get(LifecycleStateManager);
    stateOperations
      .dispatch(new UpdateState())
      .pipe(tap(() => lc.invokeInit(mappedStores)))
      .subscribe(() => {});
  }

  addChildInLocalization(
    child: StateClassInternal,
    localization: SelectLocation,
    params: { childName?: string; context?: string }
  ) {
    const stateOperations = this._internalStateOperations.getRootStateOperations();
    const mappedStores: MappedStore[] = [];
    params.childName = !params.childName
      ? (params.childName = child[META_KEY]!.name!)
      : params.childName;
    params.context = !params.context ? (params.context = '') : params.context;
    mappedStores.push(
      ...this.addChildInternal(child, params.childName, stateOperations, localization, {
        context: params.context
      })
    );

    const lc = this._injector.get(LifecycleStateManager);
    stateOperations
      .dispatch(new UpdateState())
      .pipe(tap(() => lc.invokeInit(mappedStores)))
      .subscribe(() => {
        // this._stateFactory.invokeInit(mappedStores);
      });
  }
  /**
   * Removes State from State Data tree and MappedStores in given location with all its children
   */
  removeStateInPath(location: SelectLocation) {
    this.removeChildInternal(location);
  }

  /**
   * Removes state by name with all its children
   */
  removeChildByName(childName: string) {
    const has = this._stateFactory.states.find(s => s.name === childName);
    if (!has && isDevMode())
      console.error('State of name ' + childName + ' dont exists. Cannot delete state');
    else this.removeChildInternal(SelectLocation.filterByPath(has!.path));
  }
  removeChild(child: StateClassInternal) {
    this.removeChildByName(child[META_KEY]!.name!);
  }

  /**
   * Searches for state with given name added in root path and returns path to that state
   */
  getStateLocationInPath(root: SelectLocation, stateName: string): SelectLocation {
    const state = this._stateFactory.states.find(
      p => p.path.startsWith(root.path) && p.name === stateName
    );
    if (state === undefined) throw new Error(`State ${stateName} doesn't exist in location`);
    return SelectLocation.filterByPath(state!.path);
  }

  getStateLocationByStateClass(stateClass: StateClassInternal): SelectLocation {
    return SelectLocation.filterByPath(stateClass[META_KEY]!.path!);
  }
  getLocationByState(state: any): SelectLocation {
    function findObject(obj: Object, path: string): string {
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
    return SelectLocation.filterByPath(s);
  }

  private addChildInternal(
    child: StateClassInternal,
    childName: string,
    stateOperations: StateOperations<StateClass>,
    location: SelectLocation,
    params: { context: string }
  ): MappedStore[] {
    if (!child[META_KEY]) throw new Error('States must be decorated with @State() decorator');
    const currentState = stateOperations.getState();
    const currentPath = this._stateFactory.getLocationPath(location);
    const mappedStores: MappedStore[] = [];
    const actions: PlainObjectOf<ActionHandlerMetaData[]> = child[META_KEY]!.actions;
    const selectors: PlainObjectOf<SelectorMetaDataModel> = child[META_KEY]!.selectors;
    const stateDefaults = child[META_KEY]!.defaults;
    const path = `${currentPath}.${childName}`;
    child[META_KEY]!.path = path;
    child[META_KEY]!.makeRootSelector = propGetter(path.split('.'), this._config);
    const has = this._stateFactory.states.find(s => s.path === path);
    if (has && isDevMode()) {
      console.error(`State name: ${childName} already added in location ${path}`);
      return mappedStores;
    }
    let defaults;
    // create new instance of defaults
    if (Array.isArray(stateDefaults)) {
      defaults = [...stateDefaults];
    } else if (isObject(stateDefaults)) {
      defaults = { ...stateDefaults };
    } else if (stateDefaults === undefined) {
      defaults = {};
    }

    const instance = this._injector.get(child);
    mappedStores.push({
      actions,
      selectors,
      instance,
      defaults,
      name: childName,
      path,
      context: params.context,
      isInitialised: false
    });

    this._stateFactory.states.push(...mappedStores);

    const newState = setValue(currentState, path, defaults);
    stateOperations.setState(newState);
    const { children } = child[META_KEY]!;
    if (children)
      children.forEach((item: any) =>
        mappedStores.push(
          ...this.addChildInternal(
            item,
            item[META_KEY].name,
            stateOperations,
            SelectLocation.filterByPath(path),
            params
          )
        )
      );

    return mappedStores;
  }

  private removeChildInternal(location: SelectLocation) {
    const stateOperations = this._internalStateOperations.getRootStateOperations();
    const cur = stateOperations.getState();

    const has = this._stateFactory.states.find(s => s.path === location.path);
    if (!has) {
      if (isDevMode()) {
        console.error(`State in location ${location.path} dont exists. Cannot delete state`);
      }
    } else {
      const checkedChildren = this._stateFactory.states.filter(p =>
        p.path.startsWith(has.path)
      );
      for (const innerChild of checkedChildren) {
        const index = this._stateFactory.states.indexOf(innerChild);
        this._stateFactory.states.splice(index, 1);
      }
      const newState = this.clearValue(cur, has.path);
      stateOperations.setState({ ...newState });
      stateOperations.dispatch(new UpdateState()).subscribe(() => {});
    }
  }

  private clearValue = (obj: any, prop: string) => {
    obj = { ...obj };

    const split = prop.split('.');
    const lastIndex = split.length - 1;

    split.reduce((acc, part, index) => {
      if (index === lastIndex) {
        delete acc[part];
      } else {
        acc[part] = { ...acc[part] };
      }

      return acc && acc[part];
    }, obj);

    return obj;
  };
}
