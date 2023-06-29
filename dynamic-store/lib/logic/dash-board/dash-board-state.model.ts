import { BaseSimpleStoreModel } from '../../model/store/base-simple-store.model';
import { IEmptyObject } from '../../model/base/base';
import { ElementDataModel, ElementsDataModel } from '../../model/domain/elementDataModel';

export interface DashBoardDataModel {
  lastId: number;
  id: number;
  simulate: boolean;
}

export interface DashBoardContextItemModel extends ElementDataModel {
  location: string;
}

export type DashBoardContextModel = ElementsDataModel<DashBoardContextItemModel>;

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
