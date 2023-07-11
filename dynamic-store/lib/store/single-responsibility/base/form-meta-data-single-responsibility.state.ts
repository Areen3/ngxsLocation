import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateMetaDataAction } from './meta-data-state.actions';
import {
  HostSingleResponsibilityAreaAccessModel,
  MetaDataSingleResponsibilityStoreModel
} from '../../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';

@State<MetaDataSingleResponsibilityStoreModel>({
  name: StateNamesEnum.formMetaData,
  defaults: {
    metaData: {}
  }
})
@Injectable()
export class FormMetaDataSingleResponsibilityState<
    T extends IEmptyObject,
    TCtx extends HostSingleResponsibilityAreaAccessModel
  >
  extends BaseSingleResponsibilityState<TCtx>
  implements NgxsOnInit
{
  @Action(UpdateMetaDataAction)
  UpdateDataAction(ctx: StateContext<T>, action: UpdateMetaDataAction<T>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      ...action.payload
    });
  }

  ngxsOnInit(ctx: StateContext<T>): void {
    this.host.ctx.metaData = ctx;
  }
}
