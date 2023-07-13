import { VehicleModel } from '../../model/domain/vehicle.model';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { IEmptyObject } from '../../model/base/base';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleItemDataModel extends VehicleModel {}

export interface VehicleItemViewModel {
  remove: boolean;
}

export interface BaseStateModel<
  TModel extends IEmptyObject,
  TView extends IEmptyObject,
  TList extends IEmptyObject
> {
  model: TModel;
  view: TView;
  elements: TList;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VehicleStateModel<T extends VehicleModel = VehicleModel>
  extends BaseStateModel<T, VehicleItemViewModel, VehicleItemModel> {}
