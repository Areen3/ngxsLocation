import { BaseActionWithPayload } from '../../model/store/actions';

enum RouterActionType {
  setIsLoading = '[router] set is loading',
  setLoaded = '[router] set loaded'
}

export class SetIsLoadingRouterAction extends BaseActionWithPayload<boolean> {
  static readonly type = RouterActionType.setIsLoading;
}

export class SetLoadedRouterAction extends BaseActionWithPayload<boolean> {
  static readonly type = RouterActionType.setLoaded;
}
