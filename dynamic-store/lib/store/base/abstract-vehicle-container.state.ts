import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  VehicleContainerElementsModel,
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
import { registerSelectorVehicleContainerMethod } from '../../model/decorators/register-selector-vehicle-container-method.decorator';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

@State<VehicleContainerStateModel>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleContainer),
  defaults: undefined
})
@Injectable()
export class AbstractVehicleContainerState {
  @Selector()
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dependencyInjectedStore)
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dynamicStore)
  static formElements$(state: VehicleContainerStateModel): VehicleContainerElementsModel {
    return state.elements;
  }

  @Selector()
  static state$(state: VehicleContainerStateModel): VehicleContainerStateModel {
    return state;
  }

  @Selector()
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dependencyInjectedStore)
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dynamicStore)
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
