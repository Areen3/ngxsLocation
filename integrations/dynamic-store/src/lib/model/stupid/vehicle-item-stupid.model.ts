import { VehicleModel } from '../domain/vehicle.model';
import { IEmptyObject } from '../base/base';

export interface VehicleItemStupidModelModel extends IEmptyObject {
  vehicle: VehicleModel;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemStupidViewModel {}
