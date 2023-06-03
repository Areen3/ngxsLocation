import { Component, Input } from '@angular/core';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';
import { DashBoardItemModel } from '../../../logic/dash-board/dash-board-state.model';

@Component({
  selector: 'vehicle-container',
  templateUrl: './vehicle-container.component.html'
})
export class VehicleContainerComponent {
  @Input()
  data: DashBoardItemModel;
  constructor(private container: VehicleContainerManagerService) {}

  RemoveContainer() {
    this.container.removeContainer(this.data);
  }
}
