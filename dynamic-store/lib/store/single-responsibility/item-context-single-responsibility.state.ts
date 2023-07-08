import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { UpdateItemContextAction } from './context-state.actions';
import { ElementContextDataModel } from '../../model/domain/elementDataModel';
import { ContextSingleResponsibilityStoreModel } from '../../model/store/base-simple-store.model';

@State<ContextSingleResponsibilityStoreModel<ElementContextDataModel>>({
  name: StateNamesEnum.formContext,
  defaults: {
    context: { name: '', id: 0, location: '' }
  }
})
@Injectable()
export class FormContextSingleResponsibilityState extends BaseSingleResponsibilityState {
  @Selector()
  static formContext$(
    state: ContextSingleResponsibilityStoreModel<ElementContextDataModel>
  ): ContextSingleResponsibilityStoreModel<ElementContextDataModel>['context'] {
    return state.context;
  }

  @Action(UpdateItemContextAction)
  UpdateItemContextAction(
    ctx: StateContext<ContextSingleResponsibilityStoreModel<ElementContextDataModel>>,
    action: UpdateItemContextAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      context: {
        ...state.context,
        ...action.payload
      }
    });
  }
}
