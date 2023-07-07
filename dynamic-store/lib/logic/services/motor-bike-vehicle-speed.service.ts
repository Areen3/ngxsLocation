import { Injectable } from '@angular/core';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { registerVehicleService } from '../../model/decorators/register-vehicle-service.decorator';

@Injectable()
@registerVehicleService(VehicleEnum.motorBike)
export class MotorBikeVehicleSpeedService<T extends VehicleModel = VehicleModel>
  implements AbstractVehicleSpeedService<T>
{
  constructor(private readonly multiplier: AbstractSpeedMultiplierService) {}
  getSpeed(): number {
    return this.multiplier.getSpeed(120);
  }
  getEmptyData(): T {
    const result: VehicleModel = {
      speed: this.getSpeed(),
      name: 'motor bike',
      type: VehicleEnum.motorBike
    };
    return <T>result;
  }
}
