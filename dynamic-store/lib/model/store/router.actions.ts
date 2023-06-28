import { BaseAction } from './actions';

enum RouterLoadDataActionType {
  loadDataToStore = '[router] load data for component'
}

export class LoadDataToStoreAction extends BaseAction {
  static readonly type = RouterLoadDataActionType.loadDataToStore;
}
