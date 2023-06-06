import { Action, Selector, SingleLocation, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DashBoardStateModel } from './dash-board-state.model';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AddDashboardItemAction, RemoveDashboardItemAction } from './state.actions';
import { StateBuildersUtils } from '../utils/state-builders.utils';

@State<DashBoardStateModel>({
  name: StateNamesEnum.dashBoard,
  defaults: {
    items: [],
    lastId: 0
  }
})
@Injectable()
export class DashBoardState {
  constructor(private storeBuilder: StateBuildersUtils) {}

  @Selector()
  static count$(state: DashBoardStateModel): number {
    return state.items.length;
  }

  @Selector()
  static lastId$(state: DashBoardStateModel): number {
    return state.lastId;
  }

  @Selector()
  static items$(state: DashBoardStateModel): DashBoardStateModel['items'] {
    return state.items;
  }

  @Action(AddDashboardItemAction)
  AddDashboardItemAction(
    ctx: StateContext<DashBoardStateModel>,
    action: AddDashboardItemAction
  ) {
    const state = ctx.getState();
    const name = this.storeBuilder.buildStateName(
      StateNamesEnum.vehicleContainer,
      action.payload
    );
    const locContainer = SingleLocation.getLocation(StateNamesEnum.dashBoard).getChildLocation(
      name
    );
    ctx.patchState({
      items: [...state.items, { name, id: action.payload, location: locContainer.path }],
      lastId: action.payload
    });
  }

  @Action(RemoveDashboardItemAction)
  RemoveDashboardItemAction(
    ctx: StateContext<DashBoardStateModel>,
    action: RemoveDashboardItemAction
  ) {
    const state = ctx.getState();
    const items = state.items.filter(item => item.id !== action.payload);
    ctx.patchState({ items });
  }
}
