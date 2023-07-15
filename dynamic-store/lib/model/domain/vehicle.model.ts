import { VehicleEnum } from '../enums/vehicle.enum';

export interface VehicleModel {
  type: VehicleEnum;
  name: string;
  speed: number;
}
