import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { RoutingSingleResponsibilityStateModel } from '../../model/store/single-responsibility-state.model';
import { Action, Selector, StateContext } from '@ngxs/store';
import { VehicleContainerStateModel } from '../../logic/vehicle-container/vehicle-container-state.model';
import {
  SetIsLoadingRouterAction,
  SetLoadedRouterAction
} from '../../logic/routing/state.actions';
import { RoutingLoadModel } from '../../model/store/routing-load.model';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';

@State<RoutingSingleResponsibilityStateModel>({
  name: StateNamesEnum.routingState,
  defaults: { isLoading: false, loaded: false }
})
@Injectable()
export class RoutingSingleResponsibilityState extends BaseSingleResponsibilityState {
  @Selector()
  static routing$(state: VehicleContainerStateModel): RoutingLoadModel {
    return state.routing;
  }

  @Action(SetLoadedRouterAction)
  SetLoadedRouterAction(
    ctx: StateContext<VehicleContainerStateModel>,
    action: SetLoadedRouterAction
  ) {
    ctx.patchState({ routing: { isLoading: false, loaded: action.payload } });
  }

  @Action(SetIsLoadingRouterAction)
  SetIsLoadingRouterAction(
    ctx: StateContext<VehicleContainerStateModel>,
    action: SetIsLoadingRouterAction
  ) {
    ctx.patchState({ routing: { isLoading: action.payload, loaded: false } });
  }
}
