import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DashBoardStateModel } from './dash-board-state.model';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AddDashboardItemAction } from './state.actions';

@State<DashBoardStateModel>({
  name: StateNamesEnum.dashBoard,
  defaults: {
    count: 0
  },
  children: []
})
@Injectable()
export class DashBoardState {
  @Selector()
  static count$(state: DashBoardStateModel): DashBoardStateModel['count'] {
    return state.count;
  }

  @Action(AddDashboardItemAction)
  AddDashboardItem(ctx: StateContext<DashBoardStateModel>, action: AddDashboardItemAction) {
    console.log('update dashboard');
    ctx.patchState({ count: action.payload });
  }
}
