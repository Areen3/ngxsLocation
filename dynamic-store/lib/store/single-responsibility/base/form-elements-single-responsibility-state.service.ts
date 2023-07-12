import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { AddToElementsAction, RemoveFromElementsAction } from './elements-state.actions';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import {
  ElementElementsDataModel,
  ElementsDataModel
} from '../../../model/domain/elementDataModel';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { registerSelectorVehicleContainerMethod } from '../../../model/decorators/register-selector-vehicle-container-method.decorator';

@State<ElementsDataModel<ElementElementsDataModel>>({
  name: StateNamesEnum.formElements,
  defaults: { items: [] }
})
@Injectable()
export class FormElementsSingleResponsibilityState<
    T extends ElementsDataModel<ElementElementsDataModel>,
    TCtx extends HostSingleResponsibilityAreaAccessModel
  >
  extends BaseSingleResponsibilityState<TCtx>
  implements NgxsOnInit
{
  @Selector()
  @registerSelectorVehicleContainerMethod('')
  static formElements$(
    state: ElementsDataModel<ElementElementsDataModel>
  ): ElementsDataModel<ElementElementsDataModel> {
    return state;
  }

  @Action(AddToElementsAction)
  AddToElementsAction(ctx: StateContext<T>, action: AddToElementsAction) {
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

  @Action(RemoveFromElementsAction)
  RemoveFromElementsAction(ctx: StateContext<T>, action: RemoveFromElementsAction) {
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
