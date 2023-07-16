import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/enums/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import {
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../model/stupid/vehicle-item-stupid.model';
import { registerSelectorVehicleMethod } from '../../model/decorators/register-selector-vehicle-method.decorator';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from '../base/vehicle-state.actions';

@State<VehicleStateModel>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicle),
  defaults: {
    model: { name: '', type: VehicleEnum.bike, speed: 0 },
    elements: { location: '', id: 0, name: '' },
    view: { remove: false }
  },
  creationMode: {
    providers: [
      { provide: AbstractVehicleSpeedService, useClass: AbstractVehicleSpeedService }
    ]
  }
})
@Injectable()
export class VehicleDependencyInjectState<T extends VehicleModel = VehicleModel>
  implements NgxsOnInit
{
  constructor(protected readonly speedSrv: AbstractVehicleSpeedService<T>) {}

  @Selector()
  @registerSelectorVehicleMethod(VehicleContainerEnum.dependencyInjectedStore)
  static formModel$(state: VehicleStateModel): VehicleItemStupidModelModel {
    return {
      vehicle: state.model
    };
  }

  @Selector()
  @registerSelectorVehicleMethod(VehicleContainerEnum.dependencyInjectedStore)
  static formView$(_state: VehicleStateModel): VehicleItemStupidViewModel {
    return {};
  }

  @Action(UpdateVehicleAction)
  UpdateVehicle(ctx: StateContext<VehicleStateModel>, action: UpdateVehicleAction) {
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
  changeSpeedVehicle(ctx: StateContext<VehicleStateModel>, action: ChangeSpeedVehicleAction) {
    const state: VehicleStateModel = ctx.getState();
    ctx.patchState({
      model: {
        ...state.model,
        speed: action.payload
      }
    });
  }

  ngxsOnInit(ctx: StateContext<VehicleStateModel>) {
    const data = this.speedSrv.getEmptyModel();
    ctx.patchState({ model: data });
  }
}
