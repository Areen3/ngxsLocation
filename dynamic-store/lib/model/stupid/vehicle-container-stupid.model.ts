import { VehicleItemModel } from '../store/vehicle-item.model';
import { IEntity } from '../base/base';
import { VehicleContainerViewModel } from '../../store/base/vehicle-container-state.model';

export interface VehicleContainerStupidModelModel extends IEntity {
  items: Array<VehicleItemModel>;
  name: string;
}
export interface VehicleContainerStupidViewModel
  extends Pick<VehicleContainerViewModel, 'dropDown'> {
  remove: boolean;
}
