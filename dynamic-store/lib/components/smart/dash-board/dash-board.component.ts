import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import {
  DashBoardEvents,
  DashBoardEventType,
  DashBoardSimulateUsersEvent
} from '../../stupid/dash-board/dash-board.event';
import {
  DashBoardStupidModelModel,
  DashBoardStupidViewModel
} from '../../../model/stupid/dash-board-stupid-model.model';
import {
  TabsStupidModelModel,
  TabsStupidViewModel
} from '../../../model/stupid/tabs-stupid.model';
import { TabEvents, TabsEventType } from '../../stupid/tabs/tabs.event';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../../../model/enums/routing-path-enum';
import { DashBoardState } from '../../../store/dash-board/dash-board.state';
import { DashboardSimulateUsersAction } from '../../../store/dash-board/dahs-board-state.actions';

@Component({
  selector: 'dashboard',
  templateUrl: './dash-board.component.html'
})
export class DashBoardComponent {
  model$: Observable<DashBoardStupidModelModel> = this.store.select(DashBoardState.formModel$);
  view$: Observable<DashBoardStupidViewModel> = this.store.select(DashBoardState.formView$);
  elements$: Observable<TabsStupidModelModel> = this.store.select(
    DashBoardState.formElements$
  );
  viewTabs$: Observable<TabsStupidViewModel> = of({ selected: 1, isSelected: false });

  constructor(private store: Store) {}

  outputEvents(event: DashBoardEvents): void {
    switch (event.eventType) {
      case DashBoardEventType.addContainer:
        this.store.dispatch(
          new Navigate([
            RoutingPathEnum.dashboard,
            RoutingPathEnum.vehicleContainer,
            'add',
            event.data
          ])
        );
        break;
      case DashBoardEventType.simulateUsers:
        this.store.dispatch(
          new DashboardSimulateUsersAction((<DashBoardSimulateUsersEvent>event).data)
        );
    }
  }

  outputTabsEvents(event: TabEvents): void {
    switch (event.eventType) {
      case TabsEventType.tabClicked:
        this.store.dispatch(
          new Navigate([
            RoutingPathEnum.dashboard,
            RoutingPathEnum.vehicleContainer,
            event.data
          ])
        );
        break;
    }
  }
}
