import { Selector, State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DashBoardStateModel } from './dash-board-state.model';

@State<DashBoardStateModel>({
  name: 'dashBoard',
  defaults: {
    count: 0
  }
})
@Injectable()
export class DashBoardState {
  @Selector()
  static count$(state: DashBoardStateModel): DashBoardStateModel['count'] {
    return state.count;
  }
}
