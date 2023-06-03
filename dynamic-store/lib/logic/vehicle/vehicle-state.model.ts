import { VehicleModel } from '../../model/vehicle.model';

export interface VehicleStateModel<T extends VehicleModel> {
  data: T;
}
