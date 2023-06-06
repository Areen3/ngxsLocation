import { IEmptyObject } from '../../model/base/base';

export interface DashBoardItemModel {
  name: string;
  id: number;
  location: string;
}

export interface DashBoardStateModel extends IEmptyObject {
  items: Array<DashBoardItemModel>;
  lastId: number;
}
