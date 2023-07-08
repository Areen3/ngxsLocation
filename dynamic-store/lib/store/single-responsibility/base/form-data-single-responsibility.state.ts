import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateDataAction } from './data-state.actions';
import { DataSingleResponsibilityStoreModel } from '../../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';

@State<DataSingleResponsibilityStoreModel<IEmptyObject>>({
  name: StateNamesEnum.formData,
  defaults: {
    data: {}
  }
})
@Injectable()
export class FormDataSingleResponsibilityState<
  T extends IEmptyObject
> extends BaseSingleResponsibilityState {
  @Selector()
  static formData$(
    state: DataSingleResponsibilityStoreModel<IEmptyObject>
  ): DataSingleResponsibilityStoreModel<IEmptyObject>['data'] {
    return state.data;
  }

  @Action(UpdateDataAction)
  UpdateDataAction(
    ctx: StateContext<DataSingleResponsibilityStoreModel<T>>,
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
