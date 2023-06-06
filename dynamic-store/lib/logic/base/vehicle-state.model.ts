import { VehicleModel } from '../../model/domain/vehicle.model';

export interface VehicleStateModel<T extends VehicleModel = VehicleModel> {
  data: T;
}
