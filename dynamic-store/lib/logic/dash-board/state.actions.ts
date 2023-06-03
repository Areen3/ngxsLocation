import { BaseActionWithPayload } from '../../model/store/actions';

enum DashboardActionType {
  add = '[dashboard] add container',
  remove = '[dashboard] remove container'
}

export class AddDashboardItemAction extends BaseActionWithPayload<number> {
  static readonly type = DashboardActionType.add;
}

export class RemoveDashboardItemAction extends BaseActionWithPayload<number> {
  static readonly type = DashboardActionType.remove;
}
