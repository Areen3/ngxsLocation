import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { VehicleStateModel } from './vehicle-state.model';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from './state.actions';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';

@State<VehicleStateModel>({
  name: StateNamesEnum.vehicle,
  defaults: {
    data: {
      name: '',
      type: VehicleEnum.bike,
      speed: 0
    }
  },
  creationMode: {
    providers: [
      { provide: AbstractVehicleSpeedService, useClass: AbstractVehicleSpeedService }
    ]
  }
})
@Injectable()
export class VehicleState<T extends VehicleModel = VehicleModel> implements NgxsOnInit {
  constructor(protected readonly speedSrv: AbstractVehicleSpeedService<T>) {}

  @Selector()
  static vehicle$(state: VehicleStateModel): VehicleModel {
    return state.data;
  }

  @Action(UpdateVehicleAction)
  UpdateVehicleAction(ctx: StateContext<VehicleStateModel>, action: UpdateVehicleAction) {
    const state = ctx.getState();
    ctx.patchState({
      data: {
        ...state.data,
        type: action.payload.type,
        name: action.payload.name
      }
    });
  }

  @Action(ChangeSpeedVehicleAction)
  changeSpeedVehicleAction(
    ctx: StateContext<VehicleStateModel>,
    action: ChangeSpeedVehicleAction
  ) {
    const state: VehicleStateModel = ctx.getState();
    ctx.patchState({
      data: {
        ...state.data,
        speed: action.payload
      }
    });
  }

  ngxsOnInit(ctx: StateContext<VehicleStateModel>) {
    const data = this.speedSrv.getEmptyData();
    ctx.setState({ data });
  }
}
