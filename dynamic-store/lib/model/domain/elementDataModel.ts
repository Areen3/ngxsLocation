import { IEntity } from '../base/base';

export interface ElementDataModel extends IEntity {
  name: string;
}

export interface ElementsDataModel<T extends ElementDataModel> {
  items: Array<T>;
}
