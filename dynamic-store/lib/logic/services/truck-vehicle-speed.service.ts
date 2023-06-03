import { AbstractVehicleSpeedService } from '../../model/abstract-vehicle-speed.service';
import { Injectable } from '@angular/core';
import { VehicleModel } from '../../model/vehicle.model';
import { VehicleEnum } from '../../model/vehicle.enum';

@Injectable()
export class TruckVehicleSpeedService implements AbstractVehicleSpeedService {
  getSpeed(): number {
    return 90;
  }

  getEmptyData<T extends VehicleModel>(): T {
    const result: VehicleModel = {
      speed: this.getSpeed(),
      name: 'truck',
      type: VehicleEnum.truck
    };
    return <T>result;
  }
}
