import { BaseActionWithPayload } from '../../model/store/actions';

enum DashboardActionType {
  add = '[dashboard] add container'
}

export class AddDashboardItemAction extends BaseActionWithPayload<number> {
  static readonly type = DashboardActionType.add;
}
