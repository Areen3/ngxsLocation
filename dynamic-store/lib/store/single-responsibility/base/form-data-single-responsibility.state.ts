import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateDataAction } from './data-state.actions';
import {
  ContextSingleResponsibilityStoreModel,
  DataSingleResponsibilityStoreModel,
  HostSingleResponsibilityAreaAccessModel
} from '../../../model/store/base-simple-store.model';
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
    T extends IEmptyObject,
    TCtx extends HostSingleResponsibilityAreaAccessModel
  >
  extends BaseSingleResponsibilityState<TCtx>
  implements NgxsOnInit
{
  @Action(UpdateDataAction)
  UpdateDataAction(
    ctx: StateContext<DataSingleResponsibilityStoreModel<T>>,
    action: UpdateDataAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      ...action.payload
    });
  }

  ngxsOnInit(ctx: StateContext<ContextSingleResponsibilityStoreModel<T>>): void {
    this.host.ctx.data = ctx;
  }
}
