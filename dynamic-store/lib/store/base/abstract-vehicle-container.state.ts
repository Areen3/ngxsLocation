import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  VehicleContainerContextModel,
  VehicleContainerStateModel
} from '../../logic/vehicle-container/vehicle-container-state.model';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { Injectable } from '@angular/core';
import { RoutingLoadModel } from '../../model/store/routing-load.model';
import {
  SetIsLoadingRouterAction,
  SetLoadedRouterAction
} from '../../logic/routing/state.actions';
import { registerSelectorMethod } from '../../model/decorators/register-selector-method.decorator';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

@State<VehicleContainerStateModel>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleContainer),
  defaults: undefined
})
@Injectable()
export class AbstractVehicleContainerState {
  @Selector()
  @registerSelectorMethod(VehicleContainerEnum.dependencyInjectedStore)
  @registerSelectorMethod(VehicleContainerEnum.dynamicStore)
  static formContext$(state: VehicleContainerStateModel): VehicleContainerContextModel {
    return state.context;
  }

  @Selector()
  static state$(state: VehicleContainerStateModel): VehicleContainerStateModel {
    return state;
  }

  @Selector()
  @registerSelectorMethod(VehicleContainerEnum.dependencyInjectedStore)
  @registerSelectorMethod(VehicleContainerEnum.dynamicStore)
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
