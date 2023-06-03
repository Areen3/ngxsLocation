import { AbstractVehicleSpeedService } from '../../model/abstract-vehicle-speed.service';
import { Injectable } from '@angular/core';
import { VehicleModel } from '../../model/vehicle.model';
import { VehicleEnum } from '../../model/vehicle.enum';

@Injectable()
export class CarVehicleSpeedService implements AbstractVehicleSpeedService {
  getSpeed(): number {
    return 150;
  }
  getEmptyData<T extends VehicleModel>(): T {
    const result: VehicleModel = {
      speed: this.getSpeed(),
      name: 'car',
      type: VehicleEnum.car
    };
    return <T>result;
  }
}
