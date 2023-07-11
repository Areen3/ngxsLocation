import { IEmptyObject } from '../../../model/base/base';
import { BaseActionWithPayload } from '../../../model/store/actions';

enum MetaDataActionType {
  update = '[meta-data-action] update meta-data'
}

export class UpdateMetaDataAction<T extends IEmptyObject> extends BaseActionWithPayload<T> {
  static readonly type = MetaDataActionType.update;
}
