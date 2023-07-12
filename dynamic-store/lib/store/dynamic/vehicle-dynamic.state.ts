import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import {
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../model/stupid/vehicle-item-stupid.model';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from '../../logic/base/state.actions';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { registerSelectorVehicleMethod } from '../../model/decorators/register-selector-vehicle-method.decorator';

@State<VehicleStateModel>({
  name: StateNamesEnum.vehicle,
  defaults: {
    model: { name: '', type: VehicleEnum.bike, speed: 0 },
    elements: { location: '', id: 0, name: '' },
    view: { remove: false }
  }
})
@Injectable()
export class VehicleDynamicState implements NgxsOnInit {
  @Selector()
  @registerSelectorVehicleMethod(VehicleContainerEnum.dynamicStore)
  static formModel$(state: VehicleStateModel): VehicleItemStupidModelModel {
    return {
      vehicle: state.model
    };
  }

  @Selector()
  @registerSelectorVehicleMethod(VehicleContainerEnum.dynamicStore)
  static formView$(_state: VehicleStateModel): VehicleItemStupidViewModel {
    return {};
  }

  @Selector()
  static vehicle$(state: VehicleStateModel): VehicleModel {
    return state.model;
  }

  @Action(UpdateVehicleAction)
  UpdateVehicleAction(ctx: StateContext<VehicleStateModel>, action: UpdateVehicleAction) {
    const state = ctx.getState();
    ctx.patchState({
      model: {
        ...state.model,
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
      model: {
        ...state.model,
        speed: action.payload
      }
    });
  }

  ngxsOnInit(ctx: StateContext<VehicleStateModel>) {
    const data = this.getEmptyModel();
    ctx.patchState({ model: data });
  }

  protected getEmptyModel<T extends VehicleModel>(): T {
    throw new Error(`You should implement this method: ${this.getEmptyModel.name}`);
  }

  protected getSpeed(_speed: number): number {
    throw new Error(`You should implement this method: ${this.getSpeed.name}`);
  }
}
