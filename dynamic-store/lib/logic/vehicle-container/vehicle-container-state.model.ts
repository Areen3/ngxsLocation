import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { ElementsDataModel } from '../../model/domain/elementDataModel';
import { BaseStateModel } from '../base/vehicle-state.model';
import { RoutingSingleResponsibilityStateModel } from '../../model/store/base-simple-store.model';

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
  extends BaseStateModel<
      VehicleContainerDataModel,
      VehicleContainerMetaDataModel,
      VehicleContainerContextModel
    >,
    RoutingSingleResponsibilityStateModel {}
