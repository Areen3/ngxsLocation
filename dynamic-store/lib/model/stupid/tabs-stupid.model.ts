import { ElementDataModel, ElementsDataModel } from '../domain/elementDataModel';
import { IEmptyObject } from '../base/base';

export type TabsStupidDataModel = Pick<ElementsDataModel<ElementDataModel>, 'items'>;

export interface TabsStupidMetaDataModel extends IEmptyObject {
  selected: ElementDataModel['id'];
  isSelected: boolean;
}
