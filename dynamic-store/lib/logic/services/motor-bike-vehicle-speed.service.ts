import { AbstractVehicleSpeedService } from '../../model/abstract-vehicle-speed.service';
import { Injectable } from '@angular/core';
import { VehicleModel } from '../../model/vehicle.model';
import { VehicleEnum } from '../../model/vehicle.enum';

@Injectable()
export class MotorBikeVehicleSpeedService implements AbstractVehicleSpeedService {
  getSpeed(): number {
    return 120;
  }
  getEmptyData<T extends VehicleModel>(): T {
    const result: VehicleModel = {
      speed: this.getSpeed(),
      name: 'motor bike',
      type: VehicleEnum.motorBike
    };
    return <T>result;
  }
}
