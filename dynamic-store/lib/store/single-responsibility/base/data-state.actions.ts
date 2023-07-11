import { IEmptyObject } from '../../../model/base/base';
import { BaseActionWithPayload } from '../../../model/store/actions';

enum DataActionType {
  update = '[data-action] update data'
}

export class UpdateDataAction<T extends IEmptyObject> extends BaseActionWithPayload<T> {
  static readonly type = DataActionType.update;
}
