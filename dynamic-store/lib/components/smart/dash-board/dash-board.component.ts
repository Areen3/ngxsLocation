import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { DashBoardState } from '../../../logic/dash-board/dash-board.state';
import { DashBoardEvents, DashBoardEventType } from '../../stupid/dash-board/dash-board.event';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../../model/stupid/dash-board-stupid.model';
import { DashBoardContextModel } from '../../../logic/dash-board/dash-board-state.model';
import { AddVehicleContainerAppServiceAction } from '../../../store/app-service/state.actions';

@Component({
  selector: 'dashboard',
  templateUrl: './dash-board.component.html'
})
export class DashBoardComponent {
  data$: Observable<DashBoardStupidDataModel> = this.store.select(DashBoardState.formData$);
  metaData$: Observable<DashBoardStupidMetaDataModel> = this.store.select(
    DashBoardState.formMetaData$
  );
  context$: Observable<DashBoardContextModel> = this.store.select(DashBoardState.formContext$);

  constructor(private store: Store) {}

  outputEvents(event: DashBoardEvents): void {
    switch (event.eventType) {
      case DashBoardEventType.addContainer:
        this.store.dispatch(new AddVehicleContainerAppServiceAction(event.data));

        break;
    }
  }
}
