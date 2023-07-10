import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidMetaDataModel
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
import { AbstractVehicleContainerState } from '../app-service/abstract-vehicle-container.state';
import { registerSelectorMethod } from '../../model/decorators/register-selector-method.decorator';

@State<VehicleContainerStateModel>({
  name: StateBuildersUtils.buildDynamicStateName(StateNamesEnum.vehicleContainer),
  defaults: {
    routing: { isLoading: false, loaded: false },
    data: { lastId: 0, type: VehicleContainerEnum.dynamicStore, itemNumber: 0 },
    metaData: { dropDown: Object.values(VehicleEnum), containersCount: 0 },
    context: { items: [] }
  }
})
@registerContainerState(VehicleContainerEnum.dynamicStore)
@Injectable()
export class VehicleDynamicContainerState extends AbstractVehicleContainerState {
  @Selector()
  @registerSelectorMethod(VehicleContainerEnum.dynamicStore)
  static formData$(state: VehicleContainerStateModel): VehicleContainerStupidDataModel {
    return {
      items: state.context.items,
      name: state.data.type.toString(),
      id: state.data.lastId
    };
  }

  @Selector()
  @registerSelectorMethod(VehicleContainerEnum.dynamicStore)
  static formMetaData$(
    state: VehicleContainerStateModel
  ): VehicleContainerStupidMetaDataModel {
    return {
      dropDown: state.metaData.dropDown,
      remove: state.metaData.containersCount > 0
    };
  }

  @Action(AddVehicleContainerAction)
  AddVehicleContainer(
    ctx: StateContext<VehicleContainerStateModel>,
    action: AddVehicleContainerAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      data: { ...state.data, itemNumber: action.payload.id },
      metaData: { ...state.metaData, containersCount: state.metaData.containersCount + 1 }
    });
  }

  @Action(RemoveVehicleContainerAction)
  RemoveVehicleContainer(ctx: StateContext<VehicleContainerStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      metaData: { ...state.metaData, containersCount: state.metaData.containersCount - 1 }
    });
  }

  @Action(AddVehicleAction)
  AddVehicleAction(ctx: StateContext<VehicleContainerStateModel>, action: AddVehicleAction) {
    const state = ctx.getState();
    ctx.patchState({
      data: {
        ...state.data,
        lastId: action.payload.id
      },
      context: {
        ...state.context,
        items: [
          ...state.context.items,
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
      context: {
        ...state.context,
        items: state.context.items.filter(item => item.id !== action.payload)
      }
    });
  }
}
