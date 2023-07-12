import { Component } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { DashBoardState } from '../../../logic/dash-board/dash-board.state';
import {
  DashBoardEvents,
  DashBoardEventType,
  DashBoardSimulateUsersEvent
} from '../../stupid/dash-board/dash-board.event';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../../model/stupid/dash-board-stupid.model';
import {
  TabsStupidDataModel,
  TabsStupidMetaDataModel
} from '../../../model/stupid/tabs-stupid.model';
import { TabEvents, TabsEventType } from '../../stupid/tabs/tabs.event';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../../../model/enums/routing-path-enum';
import { DashboardSimulateUsersAction } from '../../../logic/dash-board/state.actions';

@Component({
  selector: 'dashboard',
  templateUrl: './dash-board.component.html'
})
export class DashBoardComponent {
  data$: Observable<DashBoardStupidDataModel> = this.store.select(DashBoardState.formData$);
  metaData$: Observable<DashBoardStupidMetaDataModel> = this.store.select(
    DashBoardState.formMetaData$
  );
  context$: Observable<TabsStupidDataModel> = this.store.select(DashBoardState.formContext$);
  metaDataTabs$: Observable<TabsStupidMetaDataModel> = of({ selected: 1, isSelected: false });

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
