import { VehicleItemModel } from '../store/vehicle-item.model';
import { VehicleContainerMetaDataModel } from '../../logic/vehicle-container/vehicle-container-state.model';
import { IEntity } from '../base/base';

export interface VehicleContainerStupidDataModel extends IEntity {
  items: Array<VehicleItemModel>;
  name: string;
}
export interface VehicleContainerStupidMetaDataModel
  extends Pick<VehicleContainerMetaDataModel, 'dropDown'> {
  remove: boolean;
}
