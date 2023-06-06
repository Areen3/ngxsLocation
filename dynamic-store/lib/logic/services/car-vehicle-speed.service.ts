import { Injectable } from '@angular/core';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';

@Injectable()
export class CarVehicleSpeedService<T extends VehicleModel = VehicleModel>
  implements AbstractVehicleSpeedService<T>
{
  constructor(private readonly multiplier: AbstractSpeedMultiplierService) {}

  getSpeed(): number {
    return this.multiplier.getSpeed(150);
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
