import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateModelAction } from './data-state.actions';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';

@State<IEmptyObject>({
  name: StateNamesEnum.formModel,
  defaults: {
    data: {}
  }
})
@Injectable()
export class FormModelSingleResponsibilityState<
    T extends IEmptyObject,
    TCtx extends HostSingleResponsibilityAreaAccessModel
  >
  extends BaseSingleResponsibilityState<TCtx>
  implements NgxsOnInit
{
  @Action(UpdateModelAction)
  UpdateModelAction(ctx: StateContext<T>, action: UpdateModelAction<IEmptyObject>) {
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
