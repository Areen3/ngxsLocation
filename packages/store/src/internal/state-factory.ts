import { Injectable, Injector, Optional, SkipSelf, Inject, isDevMode } from '@angular/core';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  mergeMap,
  shareReplay,
  takeUntil
} from 'rxjs/operators';

import { META_KEY, NgxsConfig, SELECTOR_META_KEY } from '../symbols';
import {
  buildGraph,
  findFullParentPath,
  isObject,
  MappedStore,
  MetaDataModel,
  SelectorMetaDataModel,
  nameToState,
  propGetter,
  StateClassInternal,
  StateKeyGraph,
  StatesAndDefaults,
  StatesByName,
  topologicalSort,
  RuntimeSelectorContext,
  SharedSelectorOptions
} from './internals';
import { getActionTypeFromInstance, getValue, setValue } from '../utils/utils';
import { ofActionDispatched } from '../operators/of-action';
import { ActionContext, ActionStatus, InternalActions } from '../actions-stream';
import { InternalDispatchedActionResults } from '../internal/dispatcher';
import { StateContextFactory } from '../internal/state-context-factory';
import { StoreValidators } from '../utils/store-validators';
import { INITIAL_STATE_TOKEN, PlainObjectOf, memoize } from '@ngxs/store/internals';
import { NgxsAction } from '../actions/base.action';
import { ActionKind } from '../common/declaration';
import { SelectLocation, Location, ELocationKind } from '../common';
import { createSelector } from '../utils/selector-utils';

/**
 * State factory class
 * @ignore
 */
@Injectable()
export class StateFactory {
  private _connected = false;

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

  public get states(): MappedStore[] {
    return this._parentFactory ? this._parentFactory.states : this._states;
  }

  private _statesByName: StatesByName = {};

  public get statesByName(): StatesByName {
    return this._parentFactory ? this._parentFactory.statesByName : this._statesByName;
  }

  private _statePaths: PlainObjectOf<string> = {};

  private get statePaths(): PlainObjectOf<string> {
    return this._parentFactory ? this._parentFactory.statePaths : this._statePaths;
  }

  public getRuntimeSelectorContext = memoize((location?: Location) => {
    const stateFactory = this;
    const context: RuntimeSelectorContext = this._parentFactory
      ? this._parentFactory.getRuntimeSelectorContext(location)
      : {
          getStateGetter(key: string) {
            const path = location ? location.path : stateFactory.statePaths[key];
            return path ? propGetter(path.split('.'), stateFactory._config) : () => undefined;
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

  private static checkStatesAreValid(stateClasses: StateClassInternal[]): void {
    stateClasses.forEach(StoreValidators.getValidStateMeta);
  }

  /**
   * Add a new state to the global defs.
   */
  add(stateClasses: StateClassInternal[]): MappedStore[] {
    StateFactory.checkStatesAreValid(stateClasses);
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
   * Create state item
   */
  private createStateItem(
    name: string,
    path: string,
    stateClass: StateClassInternal
  ): MappedStore {
    const meta: MetaDataModel = stateClass[META_KEY]!;
    this.addRuntimeInfoToMeta(meta, path);
    const stateMap: MappedStore = {
      name,
      path,
      isInitialised: false,
      actions: meta.actions,
      instance: this._injector.get(stateClass),
      defaults: StateFactory.cloneDefaults(meta.defaults),
      context: '',
      selectors: meta.selectors
    };
    return stateMap;
  }
  /**
   * Create selector that return slice of state in location
   */

  private addSelectorItemToState(
    stateClass: StateClassInternal,
    selector: any,
    location: Location
  ): any {
    return createSelector([], selector, {
      containerClass: stateClass,
      selectorName: selector.name,
      location: location.copy(),
      getSelectorOptions() {
        return {};
      }
    });
  }
  /**
   * Create or Get selector that return slice of state in location
   */
  getSelectorFromState(
    stateClass: StateClassInternal,
    selectorMethod: any,
    location: Location
  ) {
    const stateMap: MappedStore = this.states.find(item => item.path === location.path);
    // todo LOC make better error handling
    const storedSelector = stateMap.selectors[selectorMethod.name];
    return storedSelector
      ? selectorMethod
      : this.addSelectorItemToState(stateClass, selectorMethod, location);
  }

  /**
   * Add child to specific location
   */
  addChild(
    child: StateClassInternal,
    childName: string,
    location: Location,
    params: { context: string }
  ): MappedStore[] {
    // todo LOC make better error handling
    if (!child[META_KEY]) throw new Error('States must be decorated with @State() decorator');
    const childPath = location.path + '.' + childName;
    let mappedStore: MappedStore = this.states.find(s => s.path === childPath);
    if (mappedStore && isDevMode()) {
      console.error(`State name: ${childName} already added in location ${location}`);
      return [];
    }
    mappedStore = this.createStateItem(childName, childPath, child);
    mappedStore.context = params.context;

    // todo LOC shoud call addToStatesMap but names of states don't have to be unique
    this.states.push(mappedStore);
    return [mappedStore];
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
    if (this._connected) return;
    this._actions
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
    this._connected = true;
  }

  /**
   * Invoke actions on the states.
   */
  invokeActions(actions$: InternalActions, action: any) {
    const results = [];
    /** Variable to check if action was executed */
    let actionExecuted = false;
    for (const metadata of this.states) {
      const type = getActionTypeFromInstance(action)!;
      const actionMetas = metadata.actions[type];

      if (actionMetas) {
        /** Check if action implements NgxsAction and if store location equals to MappedStore location */
        if (action instanceof NgxsAction && action.location) {
          if (!this.checkLocationWithMappedStore(action.location, metadata)) continue;
        }
        for (const actionMeta of actionMetas) {
          const stateContext = this._stateContextFactory.createStateContext(metadata);
          try {
            let result = metadata.instance[actionMeta.fn](stateContext, action);
            actionExecuted = true; /** set action was executed */
            if (result instanceof Promise) {
              result = from(result);
            }

            if (result instanceof Observable) {
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
      action.kind === ActionKind.akCommand &&
      isDevMode
    ) {
      console.error(`Action commnad ${action.constructor.name} was not executed`);
    }
    if (!results.length) {
      results.push(of({}));
    }

    return forkJoin(results);
  }

  private addToStatesMap(
    stateClasses: StateClassInternal[]
  ): { newStates: StateClassInternal[] } {
    const newStates: StateClassInternal[] = [];
    const statesMap: StatesByName = this.statesByName;

    for (const stateClass of stateClasses) {
      const stateName: string = StoreValidators.checkStateNameIsUnique(stateClass, statesMap);
      const unmountedState = !statesMap[stateName];
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
  /** Function returns state data path based on SelectLocation and state metatadata */
  getLocationPaths(location: SelectLocation): Location[] {
    const tab: Array<MappedStore> = [];
    switch (location.locationKind) {
      case ELocationKind.byName:
        tab.push(...this.states.filter(p => p.name === location.name));
        break;
      case ELocationKind.byLocation:
        return [Location.create(location.path)];
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
    return tab.map(item => Location.create(item.path));
  }

  /** Function checks is MappedStore and SelectLocation points to same state data */
  private checkLocationWithMappedStore(
    location: SelectLocation,
    mappedStore: MappedStore
  ): boolean {
    if (location.path && location.path === mappedStore.path) {
      return true;
    }
    if (location.name) {
      if (
        location.context &&
        location.name === mappedStore.name &&
        location.context === mappedStore.context
      ) {
        return true;
      } else {
        if (location.name === mappedStore.name) {
          return true;
        }
      }
    }
    return false;
  }
}
