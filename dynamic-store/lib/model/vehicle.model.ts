import { VehicleEnum } from './vehicle.enum';

export interface VehicleModel {
  type: VehicleEnum;
  name: string;
  speed: number;
}
