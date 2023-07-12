import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import {
  VehicleContainerStupidModelModel,
  VehicleContainerStupidViewModel
} from '../../model/stupid/vehicle-container-stupid.model';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleContainerStateModel } from '../../logic/vehicle-container/vehicle-container-state.model';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction,
  RemoveVehicleContainerAction
} from '../../logic/vehicle-container/state.actions';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { registerContainerState } from '../../model/decorators/register-container-state.decorator';
import { AbstractVehicleContainerState } from '../base/abstract-vehicle-container.state';
import { registerSelectorVehicleContainerMethod } from '../../model/decorators/register-selector-vehicle-container-method.decorator';

@State<VehicleContainerStateModel>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleContainer),
  defaults: {
    routing: { isLoading: false, loaded: false },
    model: { lastId: 0, type: VehicleContainerEnum.dependencyInjectedStore, itemNumber: 0 },
    view: { dropDown: Object.values(VehicleEnum), containersCount: 0 },
    elements: { items: [] }
  }
})
@registerContainerState(VehicleContainerEnum.dependencyInjectedStore)
@Injectable()
export class VehicleDependencyInjectContainerState extends AbstractVehicleContainerState {
  @Selector()
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dependencyInjectedStore)
  static formModel$(state: VehicleContainerStateModel): VehicleContainerStupidModelModel {
    return {
      items: state.elements.items,
      name: state.model.type.toString(),
      id: state.model.lastId
    };
  }

  @Selector()
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dependencyInjectedStore)
  static formView$(state: VehicleContainerStateModel): VehicleContainerStupidViewModel {
    return {
      dropDown: state.view.dropDown,
      remove: state.view.containersCount > 0
    };
  }

  @Action(AddVehicleContainerAction)
  AddVehicleContainer(
    ctx: StateContext<VehicleContainerStateModel>,
    action: AddVehicleContainerAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      model: { ...state.model, itemNumber: action.payload.id },
      view: { ...state.view, containersCount: state.view.containersCount + 1 }
    });
  }

  @Action(RemoveVehicleContainerAction)
  RemoveVehicleContainer(ctx: StateContext<VehicleContainerStateModel>) {
    const state: VehicleContainerStateModel = ctx.getState();
    ctx.patchState({
      view: { ...state.view, containersCount: state.view.containersCount - 1 }
    });
  }

  @Action(AddVehicleAction)
  AddVehicleAction(ctx: StateContext<VehicleContainerStateModel>, action: AddVehicleAction) {
    const state = ctx.getState();
    ctx.patchState({
      model: {
        ...state.model,
        lastId: action.payload.id
      },
      elements: {
        ...state.elements,
        items: [
          ...state.elements.items,
          {
            id: action.payload.id,
            name: action.payload.name,
            location: action.payload.location
          }
        ]
      }
    });
  }

  @Action(RemoveVehicleAction)
  RemoveVehicleAction(
    ctx: StateContext<VehicleContainerStateModel>,
    action: RemoveVehicleAction
  ) {
    const state: VehicleContainerStateModel = ctx.getState();
    ctx.patchState({
      elements: {
        ...state.elements,
        items: state.elements.items.filter(item => item.id !== action.payload)
      }
    });
  }
}
