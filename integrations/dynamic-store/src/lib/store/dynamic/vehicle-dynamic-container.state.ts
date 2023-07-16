import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import {
  VehicleContainerStupidModelModel,
  VehicleContainerStupidViewModel
} from '../../model/stupid/vehicle-container-stupid.model';
import { VehicleEnum } from '../../model/enums/vehicle.enum';
import { registerContainerState } from '../../model/decorators/register-container-state.decorator';
import { AbstractVehicleContainerState } from '../base/abstract-vehicle-container.state';
import { registerSelectorVehicleContainerMethod } from '../../model/decorators/register-selector-vehicle-container-method.decorator';
import { VehicleContainerStateModel } from '../base/vehicle-container-state.model';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction,
  RemoveVehicleContainerAction
} from '../base/vehicle-container.state.actions';

@State<VehicleContainerStateModel>({
  name: StateBuildersUtils.buildDynamicStateName(StateNamesEnum.vehicleContainer),
  defaults: {
    routing: { isLoading: false, loaded: false },
    model: { lastId: 0, type: VehicleContainerEnum.dynamicStore, itemNumber: 0 },
    view: { dropDown: Object.values(VehicleEnum), containersCount: 0 },
    elements: { items: [] }
  }
})
@registerContainerState(VehicleContainerEnum.dynamicStore)
@Injectable()
export class VehicleDynamicContainerState extends AbstractVehicleContainerState {
  @Selector()
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dynamicStore)
  static formModel$(state: VehicleContainerStateModel): VehicleContainerStupidModelModel {
    return {
      items: state.elements.items,
      name: state.model.type.toString(),
      id: state.model.lastId
    };
  }

  @Selector()
  @registerSelectorVehicleContainerMethod(VehicleContainerEnum.dynamicStore)
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
    const state = ctx.getState();
    ctx.patchState({
      view: { ...state.view, containersCount: state.view.containersCount - 1 }
    });
  }

  @Action(AddVehicleAction)
  AddVehicle(ctx: StateContext<VehicleContainerStateModel>, action: AddVehicleAction) {
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
  RemoveVehicle(ctx: StateContext<VehicleContainerStateModel>, action: RemoveVehicleAction) {
    const state: VehicleContainerStateModel = ctx.getState();
    ctx.patchState({
      elements: {
        ...state.elements,
        items: state.elements.items.filter(item => item.id !== action.payload)
      }
    });
  }
}
