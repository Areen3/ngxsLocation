import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BaseSingleResponsibilityState } from './base-single-responsibility.state';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import {
  SetIsLoadingRouterAction,
  SetLoadedRouterAction
} from '../../../logic/routing/state.actions';
import { registerSelectorMethod } from '../../../model/decorators/register-selector-method.decorator';
import { RoutingLoadModel } from '../../../model/store/routing-load.model';

@State<RoutingLoadModel>({
  name: StateNamesEnum.routing,
  defaults: { isLoading: false, loaded: false }
})
@Injectable()
export class RoutingSingleResponsibilityState<
  T extends RoutingLoadModel
> extends BaseSingleResponsibilityState<HostSingleResponsibilityAreaAccessModel> {
  @Selector()
  @registerSelectorMethod('')
  static routing$(state: RoutingLoadModel): RoutingLoadModel {
    return state;
  }

  @Action(SetLoadedRouterAction)
  SetLoadedRouter(ctx: StateContext<T>, action: SetLoadedRouterAction) {
    ctx.patchState(<T>{ isLoading: false, loaded: action.payload });
  }

  @Action(SetIsLoadingRouterAction)
  SetIsLoadingRouter(ctx: StateContext<T>, action: SetIsLoadingRouterAction) {
    ctx.patchState(<T>{ isLoading: action.payload, loaded: false });
  }
}
