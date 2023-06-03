import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { VehicleContainerStateModel } from './vehicle-container-state.model';
import { AddVehicleContainerAction, RemoveVehicleContainerAction } from './state.actions';
import { VehicleContainersModel } from '../../model/vehicle-containers.model';

@State<VehicleContainerStateModel>({
  name: 'current',
  defaults: {
    data: {
      containers: []
    }
  }
})
@Injectable()
export class VehicleContainerState {
  @Selector()
  static containers$(state: VehicleContainerStateModel): VehicleContainersModel['containers'] {
    return state.data.containers;
  }

  @Action(AddVehicleContainerAction)
  profileExist(
    ctx: StateContext<VehicleContainerStateModel>,
    action: AddVehicleContainerAction
  ) {
    const state: VehicleContainerStateModel = ctx.getState();
    console.log(state, action);
  }

  @Action(RemoveVehicleContainerAction)
  updateProfile(
    ctx: StateContext<VehicleContainerStateModel>,
    action: RemoveVehicleContainerAction
  ) {
    const state: VehicleContainerStateModel = ctx.getState();
    console.log(state, action);
  }
}
