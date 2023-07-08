import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import {
  VehicleItemStupidDataModel,
  VehicleItemStupidMetaDataModel
} from '../../model/stupid/vehicle-item-stupid.model';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from '../../logic/base/state.actions';

@State<VehicleStateModel>({
  name: StateNamesEnum.vehicle,
  defaults: {
    data: { name: '', type: VehicleEnum.bike, speed: 0 },
    context: { location: '', id: 0, name: '' },
    metaData: { remove: false }
  }
})
@Injectable()
export class VehicleDynamicState implements NgxsOnInit {
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
    const data = this.getEmptyData();
    ctx.patchState({ data });
  }

  protected getEmptyData<T extends VehicleModel>(): T {
    throw new Error(`You should implement this method: ${this.getEmptyData.name}`);
  }

  protected getSpeed(_speed: number): number {
    throw new Error(`You should implement this method: ${this.getSpeed.name}`);
  }
}
