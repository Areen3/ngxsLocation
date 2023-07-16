import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { registerSelectorVehicleContainerMethod } from '../../../model/decorators/register-selector-vehicle-container-method.decorator';
import { RoutingLoadModel } from '../../../model/store/routing-load.model';
import {
  SetIsLoadingRouterAction,
  SetLoadedRouterAction
} from '../../routing/routing-state.actions';

@State<RoutingLoadModel>({
  name: StateNamesEnum.routing,
  defaults: { isLoading: false, loaded: false }
})
@Injectable()
export class RoutingSingleResponsibilityState<
  T extends RoutingLoadModel
> extends BaseSingleResponsibilityState<HostSingleResponsibilityAreaAccessModel> {
  @Selector()
  @registerSelectorVehicleContainerMethod('')
  static routing$(state: RoutingLoadModel): RoutingLoadModel {
    return state;
  }

  @Action(SetLoadedRouterAction)
  SetLoadedRouter(ctx: StateContext<T>, action: SetLoadedRouterAction) {
    ctx.patchState(<T>{ isLoading: false, loaded: action.payload });
  }

  @Action(SetIsLoadingRouterAction)
  SetIsLoadingRouter(ctx: StateContext<T>, action: SetIsLoadingRouterAction) {
    ctx.patchState(<T>{ isLoading: action.payload, loaded: false });
  }
}
