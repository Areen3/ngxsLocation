import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { VehicleStateModel } from './vehicle-state.model';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from './state.actions';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import {
  VehicleItemStupidDataModel,
  VehicleItemStupidMetaDataModel
} from '../../model/stupid/vehicle-item-stupid.model';

@State<VehicleStateModel>({
  name: StateNamesEnum.vehicle,
  defaults: {
    data: { name: '', type: VehicleEnum.bike, speed: 0 },
    context: { name: '', location: '', id: 0 },
    metaData: { remove: false }
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
  static formData$(state: VehicleStateModel): VehicleItemStupidDataModel {
    return {
      vehicle: state.data
    };
  }

  @Selector()
  static formMetaData$(_state: VehicleStateModel): VehicleItemStupidMetaDataModel {
    return {};
  }

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
    ctx.patchState({ data });
  }
}
