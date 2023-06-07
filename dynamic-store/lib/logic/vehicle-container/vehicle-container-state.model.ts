import { VehicleContainersModel } from '../../model/store/vehicle-containers.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

export interface VehicleContainerStateModel {
  type: VehicleContainerEnum;
  name: string;
  data: VehicleContainersModel;
  itemNumber: number;
  lastId: number;
}
