import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { DashBoardState } from '../../../logic/dash-board/dash-board.state';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';
import { DashBoardEvents, DashBoardEventType } from '../../stupid/dash-board/dash-board.event';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../../model/stupid/dash-board-stupid.model';
import { DashBoardContextModel } from '../../../logic/dash-board/dash-board-state.model';

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

  constructor(private store: Store, private container: VehicleContainerManagerService) {}

  outputEvents(event: DashBoardEvents): void {
    switch (event.eventType) {
      case DashBoardEventType.addContainer:
        this.container.addContainer();
        break;
    }
  }
}
