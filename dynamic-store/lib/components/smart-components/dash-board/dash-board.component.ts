import { Component } from '@angular/core';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { DashBoardState } from '../../../logic/dash-board/dash-board.state';

@Component({
  selector: 'dashboard',
  templateUrl: './dash-board.component.html'
})
export class DashBoardComponent {
  count$: Observable<number> = this.store.select(DashBoardState.count$);
  constructor(private store: Store, private container: VehicleContainerManagerService) {}

  AddContainer() {
    this.container.addContainer();
  }
}
