import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateDataAction } from './data-state.actions';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';

@State<IEmptyObject>({
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
  UpdateDataAction(ctx: StateContext<T>, action: UpdateDataAction<IEmptyObject>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      ...action.payload
    });
  }

  ngxsOnInit(ctx: StateContext<T>): void {
    this.host.ctx.model = ctx;
  }
}
