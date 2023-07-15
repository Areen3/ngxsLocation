import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { ElementsDataModel } from '../../model/domain/elementDataModel';
import { BaseStateModel } from '../base/vehicle-state.model';
import { RoutingSingleResponsibilityStateModel } from '../../model/store/base-simple-store.model';

export interface VehicleContainerModelModel {
  type: VehicleContainerEnum;
  itemNumber: number;
  lastId: number;
}

export interface VehicleContainerViewModel {
  containersCount: number;
  dropDown: Array<string>;
}

export type VehicleContainerElementsModel = ElementsDataModel<VehicleItemModel>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleContainerStateModel
  extends BaseStateModel<
      VehicleContainerModelModel,
      VehicleContainerViewModel,
      VehicleContainerElementsModel
    >,
    RoutingSingleResponsibilityStateModel {}
