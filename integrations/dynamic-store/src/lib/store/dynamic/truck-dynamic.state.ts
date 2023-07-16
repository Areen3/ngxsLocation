import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { VehicleEnum } from '../../model/enums/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { VehicleDynamicState } from './vehicle-dynamic.state';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { StateBuildersUtils } from '../utils/state-builders.utils';

@State<VehicleStateModel<VehicleModel>>({
  name: StateBuildersUtils.buildDynamicStateName(StateNamesEnum.vehicleTruck),
  defaults: {
    model: { name: '', type: VehicleEnum.truck, speed: 0 },
    elements: { id: 0, location: '', name: '' },
    view: { remove: false }
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dynamicStore, VehicleEnum.truck)
export class TruckDynamicState extends VehicleDynamicState {
  protected getEmptyModel<T extends VehicleModel>(): T {
    const result: VehicleModel = {
      speed: this.getSpeed(90),
      name: 'truck',
      type: VehicleEnum.truck
    };
    return <T>result;
  }

  protected getSpeed(speed: number): number {
    return speed * 2;
  }
}
