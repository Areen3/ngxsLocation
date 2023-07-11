import { ElementLocationModel, IEmptyObject, IEntity } from '../../model/base/base';
import { ElementDataModel, ElementsDataModel } from '../../model/domain/elementDataModel';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

export interface DashBoardDataModel extends IEntity {
  lastId: number;
  simulate: boolean;
}

export interface DashBoardContextItemModel extends ElementDataModel, ElementLocationModel {
  type: VehicleContainerEnum;
}

export type DashBoardContextModel = ElementsDataModel<DashBoardContextItemModel>;

export interface DashBoardMetaDataModel extends IEmptyObject {
  dropDown: Array<string>;
  remove: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardStateModel {
  data: DashBoardDataModel;
  metaData: DashBoardMetaDataModel;
  context: DashBoardContextModel;
}
