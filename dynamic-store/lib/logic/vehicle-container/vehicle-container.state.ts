import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { VehicleContainerStateModel } from './vehicle-container-state.model';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction,
  RemoveVehicleContainerAction
} from './state.actions';
import { VehicleContainersModel } from '../../model/store/vehicle-containers.model';
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
    data: {
      vehicles: []
    },
    name: '',
    type: VehicleContainerEnum.dynamicStore,
    itemNumber: 0,
    lastId: 0
  }
})
@Injectable()
export class VehicleContainerState {
  @Selector()
  static Data$(state: VehicleContainerStateModel): VehicleContainerStupidDataModel {
    return {
      items: state.data.vehicles,
      name: state.type.toString(),
      id: state.lastId
    };
  }

  @Selector()
  static MetaData$(state: VehicleContainerStateModel): VehicleContainerStupidMetaDataModel {
    return {
      dropDown: Object.values(VehicleEnum),
      remove: state.data.vehicles.length > 0
    };
  }

  @Selector()
  static containers$(state: VehicleContainerStateModel): VehicleContainersModel['vehicles'] {
    return state.data.vehicles;
  }

  @Selector()
  static lastId$(state: VehicleContainerStateModel): VehicleContainerStateModel['lastId'] {
    return state.lastId;
  }

  @Action(AddVehicleContainerAction)
  AddVehicleContainer(
    ctx: StateContext<VehicleContainerStateModel>,
    action: AddVehicleContainerAction
  ) {
    ctx.patchState({ itemNumber: action.payload });
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
        vehicles: [
          ...state.data.vehicles,
          {
            id: action.payload.id,
            name: action.payload.vehicle,
            location: action.payload.location
          }
        ]
      },
      lastId: action.payload.id
    });
  }

  @Action(RemoveVehicleAction)
  RemoveVehicleAction(
    ctx: StateContext<VehicleContainerStateModel>,
    action: RemoveVehicleAction
  ) {
    const state: VehicleContainerStateModel = ctx.getState();
    ctx.patchState({
      data: {
        ...state.data,
        vehicles: state.data.vehicles.filter(item => item.id !== action.payload)
      }
    });
  }
}
