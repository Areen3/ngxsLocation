import { BaseActionWithPayload } from '../../model/store/actions';

enum DashboardActionType {
  add = '[dashboard] add container',
  remove = '[dashboard] remove container',
  simulate = '[dashboard] simulate users'
}

export class DashboardAddItemAction extends BaseActionWithPayload<number> {
  static readonly type = DashboardActionType.add;
}

export class DashboardRemoveItemAction extends BaseActionWithPayload<number> {
  static readonly type = DashboardActionType.remove;
}

export class DashboardSimulateUsersAction extends BaseActionWithPayload<boolean> {
  static readonly type = DashboardActionType.simulate;
}
