import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { IEmptyObject } from '../../model/base/base';
import { MetaDataSingleResponsibilityStoreModel } from '../../model/store/base-simple-store.model';
import { UpdateDataAction } from './data-state.actions';

@State<MetaDataSingleResponsibilityStoreModel<IEmptyObject>>({
  name: StateNamesEnum.formData,
  defaults: {
    metaData: {}
  }
})
@Injectable()
export class FormMetaDataSingleResponsibilityState extends BaseSingleResponsibilityState {
  @Selector()
  static formContext$(
    state: MetaDataSingleResponsibilityStoreModel<IEmptyObject>
  ): MetaDataSingleResponsibilityStoreModel<IEmptyObject>['metaData'] {
    return state.metaData;
  }

  @Action(UpdateDataAction)
  UpdateDataAction(
    ctx: StateContext<MetaDataSingleResponsibilityStoreModel<IEmptyObject>>,
    action: UpdateDataAction
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
