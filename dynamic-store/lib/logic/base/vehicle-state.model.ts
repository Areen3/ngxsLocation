import { VehicleModel } from '../../model/domain/vehicle.model';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { IEmptyObject } from '../../model/base/base';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemDataModel extends VehicleModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemMetaDataModel {
  remove: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemContextModel extends VehicleItemModel {}

export interface BaseStateModel<
  TModel extends IEmptyObject,
  TView extends IEmptyObject,
  TList extends IEmptyObject
> {
  data: TModel;
  metaData: TView;
  context: TList;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleStateModel<T extends VehicleModel = VehicleModel>
  extends BaseStateModel<T, VehicleItemMetaDataModel, VehicleItemContextModel> {}
