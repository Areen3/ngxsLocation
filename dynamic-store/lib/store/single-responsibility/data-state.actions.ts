import { BaseActionWithPayload } from '../../model/store/actions';
import { IEmptyObject } from '../../model/base/base';

enum DataActionType {
  update = '[data-action] update data'
}

export class UpdateDataAction<
  T extends IEmptyObject = IEmptyObject
> extends BaseActionWithPayload<T> {
  static readonly type = DataActionType.update;
}
