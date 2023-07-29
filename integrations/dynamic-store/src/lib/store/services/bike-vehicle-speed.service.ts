import { Injectable } from '@angular/core';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { BikeModel } from '../../model/domain/bike.model';
import { VehicleEnum } from '../../model/enums/vehicle.enum';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { registerVehicleService } from '../../model/decorators/register-vehicle-service.decorator';

@Injectable()
@registerVehicleService(VehicleEnum.bike)
export class BikeVehicleSpeedService<T extends BikeModel = BikeModel>
  implements AbstractVehicleSpeedService<T>
{
  constructor(private readonly multiplier: AbstractSpeedMultiplierService) {}
  getSpeed(): number {
    return this.multiplier.getSpeed(20);
  }

  getEmptyModel<T extends VehicleModel>(): T {
    const result: BikeModel = {
      speed: this.getSpeed(),
      name: 'bike',
      type: VehicleEnum.bike,
      seats: 2
    };
    return <T>(<VehicleModel>result);
  }
}