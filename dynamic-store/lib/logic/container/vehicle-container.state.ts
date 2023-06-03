import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { VehicleContainerStateModel } from './vehicle-container-state.model';
import { AddVehicleContainerAction, RemoveVehicleContainerAction } from './state.actions';
import { VehicleContainersModel } from '../../model/store/vehicle-containers.model';
import { StateNamesEnum } from '../../model/store/state-names.enum';

@State<VehicleContainerStateModel>({
  name: StateNamesEnum.vehicleContainer,
  defaults: {
    data: {
      containers: []
    },
    itemNumber: 0
  }
})
@Injectable()
export class VehicleContainerState {
  @Selector()
  static containers$(state: VehicleContainerStateModel): VehicleContainersModel['containers'] {
    return state.data.containers;
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
}
