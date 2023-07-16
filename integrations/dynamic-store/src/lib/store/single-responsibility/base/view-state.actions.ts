import { IEmptyObject } from '../../../model/base/base';
import { BaseActionWithPayload } from '../../../model/store/actions';

enum ViewActionType {
  update = '[view-action] update view'
}

export class UpdateViewAction<T extends IEmptyObject> extends BaseActionWithPayload<T> {
  static readonly type = ViewActionType.update;
}
