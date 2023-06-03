import { AbstractVehicleSpeedService } from '../../model/abstract-vehicle-speed.service';
import { Injectable } from '@angular/core';
import { VehicleModel } from '../../model/vehicle.model';
import { VehicleEnum } from '../../model/vehicle.enum';
import { BikeModel } from '../../model/bike.model';

@Injectable()
export class BikeVehicleSpeedService implements AbstractVehicleSpeedService {
  getSpeed(): number {
    return 20;
  }

  getEmptyData<T extends VehicleModel>(): T {
    const result: BikeModel = {
      speed: this.getSpeed(),
      name: 'bike',
      type: VehicleEnum.bike,
      seats: 2
    };
    return <T>(<VehicleModel>result);
  }
}
