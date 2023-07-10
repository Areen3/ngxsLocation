import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import {
  BaseSimpleStoreModel,
  RoutingSingleResponsibilityStateModel
} from '../../model/store/base-simple-store.model';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { ElementsDataModel } from '../../model/domain/elementDataModel';

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
export interface VehicleContainerStateModel
  extends BaseSimpleStoreModel<
      VehicleContainerDataModel,
      VehicleContainerMetaDataModel,
      VehicleContainerContextModel
    >,
    RoutingSingleResponsibilityStateModel {}
