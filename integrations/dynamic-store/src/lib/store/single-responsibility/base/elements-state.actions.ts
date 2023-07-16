import { ElementElementsDataModel } from '../../../model/domain/elementDataModel';
import { BaseActionWithPayload } from '../../../model/store/actions';

enum ElementsActionType {
  add = '[element-action] add to element',
  remove = '[element-action] remove from element',
  update = '[element-action] update element'
}

export class AddToElementsAction<
  T extends ElementElementsDataModel = ElementElementsDataModel
> extends BaseActionWithPayload<T> {
  static readonly type = ElementsActionType.add;
}

export class RemoveFromElementsAction<
  T extends ElementElementsDataModel = ElementElementsDataModel
> extends BaseActionWithPayload<T> {
  static readonly type = ElementsActionType.remove;
}

export class UpdateItemElementsAction<
  T extends ElementElementsDataModel = ElementElementsDataModel
> extends BaseActionWithPayload<T> {
  static readonly type = ElementsActionType.update;
}
