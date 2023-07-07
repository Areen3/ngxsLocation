import { VehicleContainersModel } from '../../model/store/vehicle-containers.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { BaseSimpleStoreModel } from '../../model/store/base-simple-store.model';
import { RoutingLoadModel } from '../../model/store/routing-load.model';

export interface VehicleContainerDataModel {
  type: VehicleContainerEnum;
  itemNumber: number;
  lastId: number;
}
export interface VehicleContainerMetaDataModel {
  remove: boolean;
  dropDown: Array<string>;
}

export interface VehicleContainerContextModel extends VehicleContainersModel {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleContainerStateModel
  extends BaseSimpleStoreModel<
    VehicleContainerDataModel,
    VehicleContainerMetaDataModel,
    VehicleContainerContextModel
  > {
  routing: RoutingLoadModel;
}
