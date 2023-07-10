import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import {
  HostSingleResponsibilityAreaAccessModel,
  RoutingSingleResponsibilityStateModel
} from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { RoutingLoadModel } from '../../../model/store/routing-load.model';
import {
  SetIsLoadingRouterAction,
  SetLoadedRouterAction
} from '../../../logic/routing/state.actions';
import { registerSelectorMethod } from '../../../model/decorators/register-selector-method.decorator';

@State<RoutingSingleResponsibilityStateModel>({
  name: StateNamesEnum.routingState,
  defaults: { routing: { isLoading: false, loaded: false } }
})
@Injectable()
export class RoutingSingleResponsibilityState<
  T extends RoutingSingleResponsibilityStateModel
> extends BaseSingleResponsibilityState<HostSingleResponsibilityAreaAccessModel> {
  @Selector()
  @registerSelectorMethod('')
  static routing$(state: RoutingSingleResponsibilityStateModel): RoutingLoadModel {
    return state.routing;
  }

  @Action(SetLoadedRouterAction)
  SetLoadedRouter(ctx: StateContext<T>, action: SetLoadedRouterAction) {
    ctx.patchState(<T>{ routing: { isLoading: false, loaded: action.payload } });
  }

  @Action(SetIsLoadingRouterAction)
  SetIsLoadingRouter(ctx: StateContext<T>, action: SetIsLoadingRouterAction) {
    ctx.patchState(<T>{
      routing: { isLoading: action.payload, loaded: false }
    });
  }
}
