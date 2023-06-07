import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  VehicleContainerContextModel,
  VehicleContainerStateModel
} from './vehicle-container-state.model';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction,
  RemoveVehicleContainerAction
} from './state.actions';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidMetaDataModel
} from '../../model/stupid/vehicle-container-stupid.model';
import { VehicleEnum } from '../../model/domain/vehicle.enum';

@State<VehicleContainerStateModel>({
  name: StateNamesEnum.vehicleContainer,
  defaults: {
    data: { lastId: 0, type: VehicleContainerEnum.dynamicStore, itemNumber: 0 },
    metaData: { dropDown: Object.values(VehicleEnum), remove: false },
    context: { name: '', vehicles: [] }
  }
})
@Injectable()
export class VehicleContainerState {
  @Selector()
  static formData$(state: VehicleContainerStateModel): VehicleContainerStupidDataModel {
    return {
      items: state.context.vehicles,
      name: state.data.type.toString(),
      id: state.data.lastId
    };
  }

  @Selector()
  static formMetaData$(
    state: VehicleContainerStateModel
  ): VehicleContainerStupidMetaDataModel {
    return {
      dropDown: state.metaData.dropDown,
      remove: state.context.vehicles.length > 0
    };
  }

  @Selector()
  static context$(state: VehicleContainerStateModel): VehicleContainerContextModel {
    return state.context;
  }

  @Selector()
  static state$(state: VehicleContainerStateModel): VehicleContainerStateModel {
    return state;
  }

  @Action(AddVehicleContainerAction)
  AddVehicleContainer(
    ctx: StateContext<VehicleContainerStateModel>,
    action: AddVehicleContainerAction
  ) {
    const state = ctx.getState();
    ctx.patchState({ data: { ...state.data, itemNumber: action.payload } });
  }

  @Action(RemoveVehicleContainerAction)
  RemoveVehicleContainer(
    ctx: StateContext<VehicleContainerStateModel>,
    action: RemoveVehicleContainerAction
  ) {
    const state: VehicleContainerStateModel = ctx.getState();
    console.log(state, action);
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
        vehicles: [
          ...state.context.vehicles,
          {
            id: action.payload.id,
            name: action.payload.vehicle,
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
        vehicles: state.context.vehicles.filter(item => item.id !== action.payload)
      }
    });
  }
}
