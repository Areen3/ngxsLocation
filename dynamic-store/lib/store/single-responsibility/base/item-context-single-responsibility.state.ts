import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateItemContextAction } from './context-state.actions';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import { ElementContextDataModel } from '../../../model/domain/elementDataModel';

@State<ElementContextDataModel>({
  name: StateNamesEnum.formContext,
  defaults: { name: '', id: 0, location: '' }
})
@Injectable()
export class ItemContextSingleResponsibilityState extends BaseSingleResponsibilityState<HostSingleResponsibilityAreaAccessModel> {
  @Selector()
  static formElements$(state: ElementContextDataModel): ElementContextDataModel {
    return state;
  }

  @Action(UpdateItemContextAction)
  UpdateItemContextAction(
    ctx: StateContext<ElementContextDataModel>,
    action: UpdateItemContextAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      ...action.payload
    });
  }
}
