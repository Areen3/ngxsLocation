import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateItemElementsAction } from './elements-state.actions';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import { ElementElementsDataModel } from '../../../model/domain/elementDataModel';

@State<ElementElementsDataModel>({
  name: StateNamesEnum.formElements,
  defaults: { name: '', id: 0, location: '' }
})
@Injectable()
export class ItemElementsSingleResponsibilityState extends BaseSingleResponsibilityState<HostSingleResponsibilityAreaAccessModel> {
  @Selector()
  static formElements$(state: ElementElementsDataModel): ElementElementsDataModel {
    return state;
  }

  @Action(UpdateItemElementsAction)
  UpdateItemElementsAction(
    ctx: StateContext<ElementElementsDataModel>,
    action: UpdateItemElementsAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      ...action.payload
    });
  }
}
