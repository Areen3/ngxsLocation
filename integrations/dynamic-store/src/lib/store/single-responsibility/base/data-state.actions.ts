import { IEmptyObject } from '../../../model/base/base';
import { BaseActionWithPayload } from '../../../model/store/actions';

enum ModelActionType {
  update = '[model-action] update model'
}

export class UpdateModelAction<T extends IEmptyObject> extends BaseActionWithPayload<T> {
  static readonly type = ModelActionType.update;
}
