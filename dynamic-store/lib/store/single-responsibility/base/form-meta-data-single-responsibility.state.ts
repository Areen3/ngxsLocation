import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateMetaDataAction } from './meta-data-state.actions';
import { MetaDataSingleResponsibilityStoreModel } from '../../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';

@State<MetaDataSingleResponsibilityStoreModel<IEmptyObject>>({
  name: StateNamesEnum.formMetaData,
  defaults: {
    metaData: {}
  }
})
@Injectable()
export class FormMetaDataSingleResponsibilityState<
  T extends IEmptyObject
> extends BaseSingleResponsibilityState {
  @Selector()
  static formMetaData$(
    state: MetaDataSingleResponsibilityStoreModel<IEmptyObject>
  ): MetaDataSingleResponsibilityStoreModel<IEmptyObject>['metaData'] {
    return state.metaData;
  }

  @Action(UpdateMetaDataAction)
  UpdateDataAction(
    ctx: StateContext<MetaDataSingleResponsibilityStoreModel<T>>,
    action: UpdateMetaDataAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      metaData: {
        ...state.metaData,
        ...action.payload
      }
    });
  }
}
