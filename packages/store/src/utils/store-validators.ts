import {
    throwMissingSelectorDecoratorError,
    throwStateDecoratorError,
    throwStateNameError,
    throwStateNamePropertyError,
    throwStateNotFoundError,
    throwStateUniqueError
  } from '../configs/messages.config';
import { getSelectorMetadata, getStoreMetadata, MappedStore, SelectorMetaDataModel, StateClassInternal, StatesByName } from '../internal/internals';
export abstract class StoreValidators {
  private static stateNameRegex: RegExp = new RegExp('^[a-zA-Z0-9_]+$');

  static checkThatStateIsNamedCorrectly(name: string | null): void | never {
    if (!name) {
      throwStateNamePropertyError();
    } else if (!this.stateNameRegex.test(name)) {
      throwStateNameError(name);
    }
  }

  static checkThatStateNameIsUnique(
    stateName: string,
    state: StateClassInternal,
    statesByName: StatesByName
  ): void | never {
    const existingState = statesByName[stateName];
    if (existingState && existingState !== state) {
      throwStateUniqueError(stateName, state.name, existingState.name);
    }
  }

  static checkThatStateClassesHaveBeenDecorated(
    stateClasses: StateClassInternal[]
  ): void | never {
    stateClasses.forEach((stateClass: StateClassInternal) => {
      if (!getStoreMetadata(stateClass)) {
        throwStateDecoratorError(stateClass.name);
      }
    });
  }
  public static getStateFromMetaStore(states: MappedStore[], path: string): MappedStore {
    const stateMap: MappedStore | undefined = states.find(item => item.path === path);
    if (!stateMap) throwStateNotFoundError(path);
    return stateMap!;
  }
  public static getValidSelectorMeta(selector: any): SelectorMetaDataModel {
    const meta: SelectorMetaDataModel = getSelectorMetadata(selector);
    if (!meta) throwMissingSelectorDecoratorError(selector.name);
    return meta!;
  }
  public static checkStateExists(state: any, path: string): void {
    if (!state) throwStateNotFoundError(path);
  }
}
