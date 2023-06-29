import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { VehicleDynamicState } from './vehicle-dynamic.state';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';

@State<VehicleStateModel<VehicleModel>>({
  name: StateBuildersUtils.buildDynamicStateName(StateNamesEnum.vehicleMotoBike),
  defaults: {
    data: { name: '', type: VehicleEnum.motorBike, speed: 0 },
    context: { id: 0, location: '' },
    metaData: { remove: false }
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dynamicStore, VehicleEnum.motorBike)
export class MotoBikeDynamicState extends VehicleDynamicState {
  protected getEmptyData<T extends VehicleModel>(): T {
    const result: VehicleModel = {
      speed: this.getSpeed(120),
      name: 'motor bike',
      type: VehicleEnum.motorBike
    };
    return <T>result;
  }

  protected getSpeed(speed: number): number {
    return speed * 2;
  }
}