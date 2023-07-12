import { VehicleItemModel } from '../store/vehicle-item.model';
import { VehicleContainerViewModel } from '../../logic/vehicle-container/vehicle-container-state.model';
import { IEntity } from '../base/base';

export interface VehicleContainerStupidDataModel extends IEntity {
  items: Array<VehicleItemModel>;
  name: string;
}
export interface VehicleContainerStupidViewModel
  extends Pick<VehicleContainerViewModel, 'dropDown'> {
  remove: boolean;
}
