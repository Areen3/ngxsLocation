import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import {
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../model/stupid/vehicle-item-stupid.model';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from '../../logic/base/state.actions';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { registerSelectorVehicleMethod } from '../../model/decorators/register-selector-vehicle-method.decorator';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

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
    const data = this.speedSrv.getEmptyData();
    ctx.patchState({ model: data });
  }
}
