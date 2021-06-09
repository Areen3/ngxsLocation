import { ELocationKind, RangeLocations } from './../common/selectLocation';
import { ActionKind } from './../common/declaration';
import { SingleLocation } from './../common/location';
import {
  Inject,
  Injectable,
  Injector,
  isDevMode,
  OnDestroy,
  Optional,
  SkipSelf
} from '@angular/core';
import { forkJoin, from, Observable, of, Subscription, throwError } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  mergeMap,
  shareReplay,
  takeUntil
} from 'rxjs/operators';

import { META_KEY, NgxsConfig } from '../symbols';
import {
  buildGraph,
  findFullParentPath,
  isObject,
  MappedStore,
  MetaDataModel,
  nameToState,
  propGetter,
  StateClassInternal,
  StateKeyGraph,
  StatesAndDefaults,
  StatesByName,
  topologicalSort,
  RuntimeSelectorContext,
  SharedSelectorOptions,
  getStoreMetadata
} from './internals';
import {
  getActionTypeFromInstance,
  getValue,
  removeLastSegment,
  removeLastValue,
  setValue
} from '../utils/utils';
import { ofActionDispatched } from '../operators/of-action';
import { ActionContext, ActionStatus, InternalActions } from '../actions-stream';
import { InternalDispatchedActionResults } from '../internal/dispatcher';
import { StateContextFactory } from '../internal/state-context-factory';
import { StoreValidators } from '../utils/store-validators';
import { INITIAL_STATE_TOKEN, PlainObjectOf, memoize } from '@ngxs/store/internals';
import { NgxsAction } from '../actions/base.action';
import { createSelector } from '../utils/selector-utils';

/**
 * State factory class
 * @ignore
 */
@Injectable()
export class StateFactory implements OnDestroy {
  private _actionsSubscription: Subscription | null = null;

  constructor(
    private _injector: Injector,
    private _config: NgxsConfig,
    @Optional()
    @SkipSelf()
    private _parentFactory: StateFactory,
    private _actions: InternalActions,
    private _actionResults: InternalDispatchedActionResults,
    private _stateContextFactory: StateContextFactory,
    @Optional()
    @Inject(INITIAL_STATE_TOKEN)
    private _initialState: any
  ) {}

  private _states: MappedStore[] = [];

  get states(): MappedStore[] {
    return this._parentFactory ? this._parentFactory.states : this._states;
  }

  private _statesByName: StatesByName = {};

  get statesByName(): StatesByName {
    return this._parentFactory ? this._parentFactory.statesByName : this._statesByName;
  }

  private _statePaths: PlainObjectOf<string> = {};

  private get statePaths(): PlainObjectOf<string> {
    return this._parentFactory ? this._parentFactory.statePaths : this._statePaths;
  }

  public getRuntimeSelectorContext = memoize((location?: SingleLocation) => {
    const stateFactory = this;

    function resolveGetter(key: string) {
      const path = location ? location.path : stateFactory.statePaths[key];
      return path ? propGetter(path.split('.'), stateFactory._config) : null;
    }

    const context: RuntimeSelectorContext = this._parentFactory
      ? this._parentFactory.getRuntimeSelectorContext(location)
      : {
          getStateGetter(key: string) {
            let getter = resolveGetter(key);
            if (getter) {
              return getter;
            }
            return (...args) => {
              // Late loaded getter
              if (!getter) {
                getter = resolveGetter(key);
              }
              return getter ? getter(...args) : undefined;
            };
          },
          getSelectorOptions(localOptions?: SharedSelectorOptions) {
            const globalSelectorOptions = stateFactory._config.selectorOptions;
            return {
              ...globalSelectorOptions,
              ...(localOptions || {})
            };
          }
        };
    return context;
  });

  private static cloneDefaults(defaults: any): any {
    let value = {};

    if (Array.isArray(defaults)) {
      value = defaults.slice();
    } else if (isObject(defaults)) {
      value = { ...defaults };
    } else if (defaults === undefined) {
      value = {};
    } else {
      value = defaults;
    }

    return value;
  }

  ngOnDestroy(): void {
    // I'm using non-null assertion here since `_actionsSubscrition` will
    // be 100% defined. This is because `ngOnDestroy()` cannot be invoked
    // on the `StateFactory` until its initialized :) An it's initialized
    // for the first time along with the `NgxsRootModule`.
    this._actionsSubscription!.unsubscribe();
  }

  /**
   * Add a new state to the global defs.
   */
  add(stateClasses: StateClassInternal[]): MappedStore[] {
    // Caretaker note: we have still left the `typeof` condition in order to avoid
    // creating a breaking change for projects that still use the View Engine.
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      StoreValidators.checkThatStateClassesHaveBeenDecorated(stateClasses);
    }

    const { newStates } = this.addToStatesMap(stateClasses);
    if (!newStates.length) return [];

    const stateGraph: StateKeyGraph = buildGraph(newStates);
    const sortedStates: string[] = topologicalSort(stateGraph);
    const paths: PlainObjectOf<string> = findFullParentPath(stateGraph);
    const nameGraph: PlainObjectOf<StateClassInternal> = nameToState(newStates);
    const bootstrappedStores: MappedStore[] = [];

    for (const name of sortedStates) {
      const stateClass: StateClassInternal = nameGraph[name];
      const path: string = paths[name];
      const stateMap: MappedStore = this.createStateItem(name, path, stateClass);

      // ensure our store hasn't already been added
      // but don't throw since it could be lazy
      // loaded from different paths
      if (!this.hasBeenMountedAndBootstrapped(name, path)) {
        bootstrappedStores.push(stateMap);
      }

      this.states.push(stateMap);
    }

    return bootstrappedStores;
  }

  /**
   * Create selector that return slice of state in given location
   */

  private addSelectorItemToState(
    stateClass: StateClassInternal,
    selector: any,
    location: SingleLocation
  ): any {
    return createSelector([], selector, {
      containerClass: stateClass,
      selectorName: selector.name,
      location: location.getLocation(),
      getSelectorOptions() {
        return {};
      }
    });
  }

  /**
   * Create and store or Get selector that return slice of state in given location
   */
  getSelectorFromState(
    stateClass: StateClassInternal,
    selector: any,
    location: SingleLocation
  ) {
    // const stateMap: MappedStore = StoreValidators.getStateFromMetaStore(this.states, location.path);
    // if (stateMap.selectors[selector.name] === undefined) {
    //   stateMap.selectors[selector.name] = this.addSelectorItemToState(stateClass, selector, location);
    // }
    // const storedSelector = stateMap.selectors[selector.name];
    // return storedSelector ? selector : storedSelector;
    const stateMap: MappedStore = StoreValidators.getStateFromMetaStore(
      this.states,
      location.path
    );
    const storedSelector = stateMap.selectors[selector.name];
    return storedSelector
      ? selector
      : this.addSelectorItemToState(stateClass, selector, location);
  }

  /**
   * Add child to store in given location
   */
  addChild(
    child: StateClassInternal,
    childName: string,
    location: SingleLocation,
    params: { context: string }
  ): MappedStore[] {
    StoreValidators.checkThatStateClassesHaveBeenDecorated([child]);
    const childPath = `${location.path}.${childName}`;
    let mappedStore: MappedStore | undefined = this.states.find(s => s.path === childPath);
    if (mappedStore && isDevMode()) {
      console.error(`State name: ${childName} already added in location ${location}`);
      return [];
    }
    mappedStore = this.createStateItem(childName, childPath, child);
    mappedStore.context = params.context;
    // todo LOC now you can have states with same name in different location, shoud we check something in this case ?
    this.states.push(mappedStore);
    return [mappedStore];
  }
  /**
   * Remove child to store in given location and retrun new state wihtout removed elements
   */
  removeChild(currentState: any, location: SingleLocation): any {
    const statesToRemove = this.states.filter(p => p.path.startsWith(location.path));
    for (const removeItem of statesToRemove) {
      const index = this.states.indexOf(removeItem);
      this.states.splice(index, 1);
    }
    return removeLastValue(currentState, location.path);
  }

  /**
   * Add a set of states to the store and return the defaults
   */
  addAndReturnDefaults(stateClasses: StateClassInternal[]): StatesAndDefaults {
    const classes: StateClassInternal[] = stateClasses || [];

    const mappedStores: MappedStore[] = this.add(classes);
    const defaults = mappedStores.reduce(
      (result: any, mappedStore: MappedStore) =>
        setValue(result, mappedStore.path, mappedStore.defaults),
      {}
    );
    return { defaults, states: mappedStores };
  }

  /**
   * Bind the actions to the handlers
   */
  connectActionHandlers() {
    if (this._actionsSubscription !== null) return;
    this._actionsSubscription = this._actions
      .pipe(
        filter((ctx: ActionContext) => ctx.status === ActionStatus.Dispatched),
        mergeMap(({ action }) =>
          this.invokeActions(this._actions, action!).pipe(
            map(() => <ActionContext>{ action, status: ActionStatus.Successful }),
            defaultIfEmpty(<ActionContext>{ action, status: ActionStatus.Canceled }),
            catchError(error =>
              of(<ActionContext>{ action, status: ActionStatus.Errored, error })
            )
          )
        )
      )
      .subscribe(ctx => this._actionResults.next(ctx));
  }

  /**
   * Invoke actions on the states.
   */
  invokeActions(actions$: InternalActions, action: any) {
    const type = getActionTypeFromInstance(action)!;
    const results = [];
    /** Variable to check if action was executed */
    let actionExecuted = false;
    for (const metadata of this.states) {
      const actionMetas = metadata.actions[type];

      if (actionMetas) {
        /** Check if action implements NgxsAction and if store location equals to MappedStore location */
        if (
          action instanceof NgxsAction &&
          action.location &&
          !this.checkLocationToSend(action.location, metadata)
        )
          continue;

        for (const actionMeta of actionMetas) {
          const stateContext = this._stateContextFactory.createStateContext(metadata);
          try {
            let result = metadata.instance[actionMeta.fn](stateContext, action);
            actionExecuted = true; /** set action was executed */
            if (result instanceof Promise) {
              result = from(result);
            }

            if (result instanceof Observable) {
              // If this observable has been completed w/o emitting
              // any value then we wouldn't want to complete the whole chain
              // of actions. Since if any observable completes then
              // action will be canceled.
              // For instance if any action handler would've had such statement:
              // `handler(ctx) { return EMPTY; }`
              // then the action will be canceled.
              // See https://github.com/ngxs/store/issues/1568
              result = result.pipe(defaultIfEmpty({}));

              if (actionMeta.options.cancelUncompleted) {
                // todo: ofActionDispatched should be used with action class
                result = result.pipe(
                  takeUntil(actions$.pipe(ofActionDispatched(action as any)))
                );
              }
            } else {
              result = of({}).pipe(shareReplay());
            }

            results.push(result);
          } catch (e) {
            if (isDevMode()) {
              throw e;
            }
            results.push(throwError(e));
          }
        }
      }
    }
    /** I action was not executed and is of command kind then log error */
    if (
      actionExecuted === false &&
      action instanceof NgxsAction &&
      action.kind === ActionKind.akCommand // &&  isDevMode
    ) {
      console.error(`Action commnad ${action.constructor.name} was not executed`);
    }
    if (!results.length) {
      results.push(of({}));
    }

    return forkJoin(results);
  }

  /**
   * Function returns array SingleLocation matched with RangeLocations
   * array has all paths to slice of state thad dulfill all conditions results from RangeLocations
   * */
  getLocations(location: RangeLocations): SingleLocation[] {
    const tab: MappedStore[] = [];
    switch (location.locationKind) {
      case ELocationKind.byName:
        tab.push(...this.states.filter(p => p.name === location.name));
        break;
      case ELocationKind.byLocation:
        return [SingleLocation.getLocation(location.path)];
      case ELocationKind.byContext:
        tab.push(
          ...this.states.filter(
            p => p.context === location.context && p.name === location.name
          )
        );
        break;
      case ELocationKind.byContextInPath:
        tab.push(
          ...this.states
            .filter(p => p.path.startsWith(location.path) && p.name === location.name)
            .filter(p => p.context === location.context)
        );
        break;
      case ELocationKind.byPathTree:
        tab.push(
          ...this.states.filter(
            p => p.path.startsWith(location.path) && p.name === location.name
          )
        );
        break;
    }
    return tab.map(item => SingleLocation.getLocation(item.path));
  }

  private addToStatesMap(
    stateClasses: StateClassInternal[]
  ): { newStates: StateClassInternal[] } {
    const newStates: StateClassInternal[] = [];
    const statesMap: StatesByName = this.statesByName;

    for (const stateClass of stateClasses) {
      const stateName = getStoreMetadata(stateClass).name!;
      // Caretaker note: we have still left the `typeof` condition in order to avoid
      // creating a breaking change for projects that still use the View Engine.
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        StoreValidators.checkThatStateNameIsUnique(stateName, stateClass, statesMap);
      }
      const unmountedState = getStoreMetadata(stateClass).newInstance || !statesMap[stateName];
      if (unmountedState) {
        newStates.push(stateClass);
        statesMap[stateName] = stateClass;
      }
    }

    return { newStates };
  }

  private addRuntimeInfoToMeta(meta: MetaDataModel, path: string): void {
    this.statePaths[meta.name!] = path;
    // TODO: v4 - we plan to get rid of the path property because it is non-deterministic
    // we can do this when we get rid of the incorrectly exposed getStoreMetadata
    // We will need to come up with an alternative in v4 because this is used by many plugins
    meta.path = path;
  }

  private getParentState(meta: MetaDataModel): MappedStore | undefined {
    const parentPath = removeLastSegment(meta.path!);
    return this.states.find(item => item.path === parentPath);
  }

  private createCustomInjector(meta: MetaDataModel): Injector {
    const parentState = this.getParentState(meta);
    const parent = parentState ? parentState.injector : this._injector;
    return meta.providers.length
      ? Injector.create({ providers: meta.providers, parent })
      : parent;
  }

  /**
   * Create new state slice
   */
  private createStateItem(
    name: string,
    path: string,
    stateClass: StateClassInternal
  ): MappedStore {
    const meta: MetaDataModel = stateClass[META_KEY]!;
    this.addRuntimeInfoToMeta(meta, path);
    const injector = this.createCustomInjector(meta);
    const stateMap: MappedStore = {
      name,
      path,
      isInitialised: false,
      actions: meta.actions,
      injector,
      instance: injector.get(stateClass),
      defaults: StateFactory.cloneDefaults(meta.defaults),
      context: '',
      selectors: meta.selectors
    };
    return stateMap;
  }
  /**
   * @description
   * the method checks if the state has already been added to the tree
   * and completed the life cycle
   * @param name
   * @param path
   */
  private hasBeenMountedAndBootstrapped(name: string, path: string): boolean {
    const valueIsBootstrappedInInitialState: boolean =
      getValue(this._initialState, path) !== undefined;
    return this.statesByName[name] && valueIsBootstrappedInInitialState;
  }

  /** Function checks is MappedStore and RangeLocations points to same state data */
  private checkLocationToSend(location: SingleLocation, mappedStore: MappedStore): boolean {
    return location.path && location.path === mappedStore.path ? true : false;
  }
}
