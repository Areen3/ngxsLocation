import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { AddToContextAction, RemoveFromContextAction } from './context-state.actions';
import {
  ElementContextDataModel,
  ElementsDataModel
} from '../../model/domain/elementDataModel';
import { ContextSingleResponsibilityStoreModel } from '../../model/store/base-simple-store.model';

@State<ContextSingleResponsibilityStoreModel<ElementsDataModel<ElementContextDataModel>>>({
  name: StateNamesEnum.formContext,
  defaults: {
    context: { items: [] }
  }
})
@Injectable()
export class FormContextSingleResponsibilityState extends BaseSingleResponsibilityState {
  @Selector()
  static formContext$(
    state: ContextSingleResponsibilityStoreModel<ElementsDataModel<ElementContextDataModel>>
  ): ContextSingleResponsibilityStoreModel<
    ElementsDataModel<ElementContextDataModel>
  >['context'] {
    return state.context;
  }

  @Action(AddToContextAction)
  AddToContextAction(
    ctx: StateContext<
      ContextSingleResponsibilityStoreModel<ElementsDataModel<ElementContextDataModel>>
    >,
    action: AddToContextAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      context: {
        ...state.context,
        items: [
          ...state.context.items,
          {
            ...action.payload,
            id: action.payload.id,
            name: action.payload.name,
            location: action.payload.location
          }
        ]
      }
    });
  }

  @Action(RemoveFromContextAction)
  RemoveFromContextAction(
    ctx: StateContext<
      ContextSingleResponsibilityStoreModel<ElementsDataModel<ElementContextDataModel>>
    >,
    action: RemoveFromContextAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      context: {
        ...state.context,
        items: state.context.items.filter(item => item.id !== action.payload.id)
      }
    });
  }
}
