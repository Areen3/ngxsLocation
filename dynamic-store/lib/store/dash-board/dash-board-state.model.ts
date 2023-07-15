import { ElementLocationModel, IEmptyObject, IEntity } from '../../model/base/base';
import { ElementDataModel, ElementsDataModel } from '../../model/domain/elementDataModel';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { BaseStateModel } from '../base/vehicle-state.model';

export interface DashBoardModelModel extends IEntity {
  lastId: number;
  simulate: boolean;
}

export interface DashBoardElementsItemModel extends ElementDataModel, ElementLocationModel {
  type: VehicleContainerEnum;
}

export type DashBoardElementsModel = ElementsDataModel<DashBoardElementsItemModel>;

export interface DashBoardViewModel extends IEmptyObject {
  dropDown: Array<string>;
  remove: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardStateModel
  extends BaseStateModel<DashBoardModelModel, DashBoardViewModel, DashBoardElementsModel> {}
