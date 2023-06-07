import { VehicleItemModel } from '../store/vehicle-item.model';
import { VehicleContainerMetaDataModel } from '../../logic/vehicle-container/vehicle-container-state.model';

export interface VehicleContainerStupidDataModel {
  items: Array<VehicleItemModel>;
  name: string;
  id: number;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleContainerStupidMetaDataModel extends VehicleContainerMetaDataModel {}
