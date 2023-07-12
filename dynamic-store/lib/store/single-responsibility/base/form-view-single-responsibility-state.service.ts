import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateViewAction } from './view-state.actions';
import {
  HostSingleResponsibilityAreaAccessModel,
  ViewSingleResponsibilityStoreModel
} from '../../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';

@State<ViewSingleResponsibilityStoreModel>({
  name: StateNamesEnum.formView,
  defaults: {}
})
@Injectable()
export class FormViewSingleResponsibilityState<
    T extends IEmptyObject,
    TCtx extends HostSingleResponsibilityAreaAccessModel
  >
  extends BaseSingleResponsibilityState<TCtx>
  implements NgxsOnInit
{
  @Action(UpdateViewAction)
  UpdateViewAction(ctx: StateContext<T>, action: UpdateViewAction<T>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      ...action.payload
    });
  }

  ngxsOnInit(ctx: StateContext<T>): void {
    this.host.ctx.view = ctx;
  }
}
