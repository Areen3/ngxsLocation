import { VehicleModel } from '../../model/domain/vehicle.model';

export interface VehicleStateModel<T extends VehicleModel> {
  data: T;
}
