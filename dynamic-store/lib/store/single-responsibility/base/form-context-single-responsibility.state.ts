import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { AddToContextAction, RemoveFromContextAction } from './context-state.actions';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import {
  ElementContextDataModel,
  ElementsDataModel
} from '../../../model/domain/elementDataModel';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { registerSelectorVehicleContainerMethod } from '../../../model/decorators/register-selector-vehicle-container-method.decorator';

@State<ElementsDataModel<ElementContextDataModel>>({
  name: StateNamesEnum.formContext,
  defaults: { items: [] }
})
@Injectable()
export class FormContextSingleResponsibilityState<
    T extends ElementsDataModel<ElementContextDataModel>,
    TCtx extends HostSingleResponsibilityAreaAccessModel
  >
  extends BaseSingleResponsibilityState<TCtx>
  implements NgxsOnInit
{
  @Selector()
  @registerSelectorVehicleContainerMethod('')
  static formElements$(
    state: ElementsDataModel<ElementContextDataModel>
  ): ElementsDataModel<ElementContextDataModel> {
    return state;
  }

  @Action(AddToContextAction)
  AddToContextAction(ctx: StateContext<T>, action: AddToContextAction) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      items: [
        ...state.items,
        {
          ...action.payload,
          id: action.payload.id,
          name: action.payload.name,
          location: action.payload.location
        }
      ]
    });
  }

  @Action(RemoveFromContextAction)
  RemoveFromContextAction(ctx: StateContext<T>, action: RemoveFromContextAction) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      items: state.items.filter(item => item.id !== action.payload.id)
    });
  }

  ngxsOnInit(ctx: StateContext<T>): void {
    this.host.ctx.elements = ctx;
  }
}
