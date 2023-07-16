import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { Injectable } from '@angular/core';
import { RoutingLoadModel } from '../../model/store/routing-load.model';
import { registerSelectorVehicleContainerMethod } from '../../model/decorators/register-selector-vehicle-container-method.decorator';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import {
  VehicleContainerElementsModel,
  VehicleContainerStateModel
} from './vehicle-container-state.model';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import {
  SetIsLoadingRouterAction,
  SetLoadedRouterAction
} from '../routing/routing-state.actions';

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
  SetLoadedRouter(
    ctx: StateContext<VehicleContainerStateModel>,
    action: SetLoadedRouterAction
  ) {
    ctx.patchState({ routing: { isLoading: false, loaded: action.payload } });
  }
  @Action(SetIsLoadingRouterAction)
  SetIsLoadingRouter(
    ctx: StateContext<VehicleContainerStateModel>,
    action: SetIsLoadingRouterAction
  ) {
    ctx.patchState({ routing: { isLoading: action.payload, loaded: false } });
  }
}
