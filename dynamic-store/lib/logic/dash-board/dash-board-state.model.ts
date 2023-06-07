import { BaseSimpleStoreModel } from '../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../model/base/base';

export interface DashBoardDataModel {
  lastId: number;
  id: number;
}

export interface DashBoardContextItemModel {
  name: string;
  location: string;
  id: number;
}
export interface DashBoardContextModel {
  items: Array<DashBoardContextItemModel>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardMetaDataModel extends IEmptyObject {
  dropDown: Array<string>;
  remove: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardStateModel
  extends BaseSimpleStoreModel<
    DashBoardDataModel,
    DashBoardMetaDataModel,
    DashBoardContextModel
  > {}
