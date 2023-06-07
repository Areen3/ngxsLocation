import { VehicleModel } from '../../model/domain/vehicle.model';
import { BaseSimpleStoreModel } from '../../model/store/base-simple-store.model';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemDataModel extends VehicleModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemMetaDataModel {
  remove: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemContextModel extends VehicleItemModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleStateModel<T extends VehicleModel = VehicleModel>
  extends BaseSimpleStoreModel<T, VehicleItemMetaDataModel, VehicleItemContextModel> {}
