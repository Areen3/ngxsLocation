import { VehicleModel } from '../domain/vehicle.model';

export abstract class AbstractVehicleSpeedService {
  abstract getSpeed(): number;
  abstract getEmptyData<T extends VehicleModel>(): T;
}
