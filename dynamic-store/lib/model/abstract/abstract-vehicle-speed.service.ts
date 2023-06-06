import { VehicleModel } from '../domain/vehicle.model';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class AbstractVehicleSpeedService<TType extends VehicleModel> {
  getSpeed(): number {
    throw new Error(
      `You should implement this method: ${AbstractVehicleSpeedService.prototype.getSpeed.name}`
    );
  }

  getEmptyData(): TType {
    throw new Error(
      `You should implement this method: ${AbstractVehicleSpeedService.prototype.getEmptyData.name}`
    );
  }
}
