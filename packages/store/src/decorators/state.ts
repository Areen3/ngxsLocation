import { StateClass } from '@ngxs/store/internals';

import { ensureStoreMetadata, MetaDataModel, StateClassInternal } from '../internal/internals';
import { META_KEY, META_OPTIONS_KEY, StoreOptions } from '../symbols';
import { StoreValidators } from '../utils/store-validators';
import { ensureStateClassIsInjectable } from '../ivy/ivy-enabled-in-dev-mode';

interface MutateMetaOptions<T> {
  meta: MetaDataModel;
  inheritedStateClass: StateClassInternal;
  optionsWithInheritance: StoreOptions<T>;
}

/**
 * Decorates a class with ngxs state information.
 */
export function State<T>(options: StoreOptions<T>) {
  function getStateOptions(inheritedStateClass: StateClassInternal): StoreOptions<T> {
    const inheritanceOptions: Partial<StoreOptions<T>> =
      inheritedStateClass[META_OPTIONS_KEY] || {};
    return { ...inheritanceOptions, ...options } as StoreOptions<T>;
  }

  function mutateMetaData(params: MutateMetaOptions<T>, target: StateClass): void {
    const { meta, optionsWithInheritance } = params;
    const { children, defaults, name, creationMode } = optionsWithInheritance;
    const stateName: string | null =
      typeof name === 'string' ? name : (name && name.getName()) || null;

    // Caretaker note: we have still left the `typeof` condition in order to avoid
    // creating a breaking change for projects that still use the View Engine.
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      StoreValidators.checkThatStateIsNamedCorrectly(stateName);
    }

    // if (inheritedStateClass.hasOwnProperty(META_KEY)) {
    //   const inheritedMeta: Partial<MetaDataModel> = inheritedStateClass[META_KEY] || {};
    //   meta.actions = { ...meta.actions, ...inheritedMeta.actions };
    // }

    if (Object.getPrototypeOf(target)) {
      const stateClasses = getInheritanceTree(target);
      for (const stateClass of stateClasses) {
        if (stateClass.hasOwnProperty(META_KEY)) {
          const parentMeta = stateClass[META_KEY];
          meta.actions = {
            ...meta.actions,
            ...parentMeta.actions
          };
          meta.selectors = {
            ...meta.selectors,
            ...parentMeta.selectors
          };
        }
      }
    }

    meta.children = children;
    meta.defaults = defaults;
    meta.name = stateName;
    const creationModeEmpty = creationMode ? creationMode : {};
    meta.providers = creationModeEmpty.providers ? creationModeEmpty.providers : [];
    meta.newInstance =
      meta.providers.length !== 0 || creationModeEmpty.newInstance
        ? creationModeEmpty.newInstance!
        : false;
  }

  return (target: StateClass): void => {
    // Caretaker note: we have still left the `typeof` condition in order to avoid
    // creating a breaking change for projects that still use the View Engine.
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      ensureStateClassIsInjectable(target);
    }
    const stateClass: StateClassInternal = target;
    const meta: MetaDataModel = ensureStoreMetadata(stateClass);
    const inheritedStateClass: StateClassInternal = Object.getPrototypeOf(stateClass);
    const optionsWithInheritance: StoreOptions<T> = getStateOptions(inheritedStateClass);
    mutateMetaData({ meta, inheritedStateClass, optionsWithInheritance }, target);
    stateClass[META_OPTIONS_KEY] = optionsWithInheritance;
  };
}

// return tree of states
export function getInheritanceTree(target: any): any[] {
  const tree = [];
  if (Object.getPrototypeOf(target)) {
    tree.push(Object.getPrototypeOf(target));
    tree.push(...getInheritanceTree(Object.getPrototypeOf(target)));
  }
  return tree;
}
