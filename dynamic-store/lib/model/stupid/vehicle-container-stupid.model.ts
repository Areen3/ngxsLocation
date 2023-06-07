import { VehicleItemModel } from '../store/vehicle-item.model';

export interface VehicleContainerStupidDataModel {
  items: Array<VehicleItemModel>;
  name: string;
  id: number;
}

export interface VehicleContainerStupidMetaDataModel {
  remove: boolean;
  dropDown: Array<string>;
}
