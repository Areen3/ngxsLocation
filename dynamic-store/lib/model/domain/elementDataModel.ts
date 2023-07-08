import { ElementLocationModel, ElementNameModel, IEntity } from '../base/base';

export interface ElementDataModel extends IEntity, ElementNameModel {}

export interface ElementsDataModel<T extends ElementDataModel> {
  items: Array<T>;
}

export interface ElementContextDataModel extends ElementDataModel, ElementLocationModel {}
