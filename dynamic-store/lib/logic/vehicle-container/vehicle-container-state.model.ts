import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { ElementsDataModel } from '../../model/domain/elementDataModel';
import { RoutingLoadModel } from '../../model/store/routing-load.model';

export interface VehicleContainerDataModel {
  type: VehicleContainerEnum;
  itemNumber: number;
  lastId: number;
}

export interface VehicleContainerMetaDataModel {
  containersCount: number;
  dropDown: Array<string>;
}

export type VehicleContainerContextModel = ElementsDataModel<VehicleItemModel>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleContainerStateModel {
  data: VehicleContainerDataModel;
  metaData: VehicleContainerMetaDataModel;
  context: VehicleContainerContextModel;
  routing: RoutingLoadModel;
}
