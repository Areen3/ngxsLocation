import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { BaseSimpleStoreModel } from '../../model/store/base-simple-store.model';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { ElementsDataModel } from '../../model/domain/elementDataModel';
import { RoutingSingleResponsibilityStateModel } from '../../model/store/single-responsibility-state.model';

export interface VehicleContainerDataModel {
  type: VehicleContainerEnum;
  itemNumber: number;
  lastId: number;
}

export interface VehicleContainerMetaDataModel {
  remove: boolean;
  dropDown: Array<string>;
}

export type VehicleContainerContextModel = ElementsDataModel<VehicleItemModel>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleContainerStateModel
  extends BaseSimpleStoreModel<
    VehicleContainerDataModel,
    VehicleContainerMetaDataModel,
    VehicleContainerContextModel
  > {
  routing: RoutingSingleResponsibilityStateModel;
}
