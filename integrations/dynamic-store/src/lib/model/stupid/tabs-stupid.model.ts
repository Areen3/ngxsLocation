import { ElementDataModel, ElementsDataModel } from '../domain/elementDataModel';
import { IEmptyObject } from '../base/base';

export type TabsStupidModelModel = Pick<ElementsDataModel<ElementDataModel>, 'items'>;

export interface TabsStupidViewModel extends IEmptyObject {
  selected: ElementDataModel['id'];
  isSelected: boolean;
}
