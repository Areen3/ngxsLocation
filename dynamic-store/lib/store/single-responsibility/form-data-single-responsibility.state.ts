import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { IEmptyObject } from '../../model/base/base';
import { DataSingleResponsibilityStoreModel } from '../../model/store/base-simple-store.model';
import { UpdateDataAction } from './data-state.actions';

@State<DataSingleResponsibilityStoreModel<IEmptyObject>>({
  name: StateNamesEnum.formData,
  defaults: {
    data: {}
  }
})
@Injectable()
export class FormDataSingleResponsibilityState extends BaseSingleResponsibilityState {
  @Selector()
  static formContext$(
    state: DataSingleResponsibilityStoreModel<IEmptyObject>
  ): DataSingleResponsibilityStoreModel<IEmptyObject>['data'] {
    return state.data;
  }

  @Action(UpdateDataAction)
  UpdateDataAction(
    ctx: StateContext<DataSingleResponsibilityStoreModel<IEmptyObject>>,
    action: UpdateDataAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      data: {
        ...state.data,
        ...action.payload
      }
    });
  }
}
