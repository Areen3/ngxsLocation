import { ElementContextDataModel } from '../../../model/domain/elementDataModel';
import { BaseActionWithPayload } from '../../../model/store/actions';

enum ContextActionType {
  add = '[context-action] add to context',
  remove = '[context-action] remove from context',
  update = '[context-action] update context'
}

export class AddToContextAction<
  T extends ElementContextDataModel = ElementContextDataModel
> extends BaseActionWithPayload<T> {
  static readonly type = ContextActionType.add;
}

export class RemoveFromContextAction<
  T extends ElementContextDataModel = ElementContextDataModel
> extends BaseActionWithPayload<T> {
  static readonly type = ContextActionType.remove;
}

export class UpdateItemContextAction<
  T extends ElementContextDataModel = ElementContextDataModel
> extends BaseActionWithPayload<T> {
  static readonly type = ContextActionType.update;
}
