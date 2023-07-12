import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { BikeModel } from '../../model/domain/bike.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { VehicleDynamicState } from './vehicle-dynamic.state';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';

@State<VehicleStateModel<BikeModel>>({
  name: StateBuildersUtils.buildDynamicStateName(StateNamesEnum.vehicleBike),
  defaults: {
    model: { name: '', type: VehicleEnum.motorBike, speed: 0, seats: 1 },
    elements: { id: 0, location: '', name: '' },
    view: { remove: false }
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dynamicStore, VehicleEnum.bike)
export class BikeDynamicState extends VehicleDynamicState {
  protected getEmptyModel<T extends VehicleModel>(): T {
    const result: BikeModel = {
      speed: this.getSpeed(20),
      name: 'bike',
      type: VehicleEnum.bike,
      seats: 2
    };
    return <T>(<VehicleModel>result);
  }

  protected getSpeed(speed: number): number {
    return speed * 1.1;
  }
}
