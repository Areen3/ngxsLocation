import { Component, Input } from '@angular/core';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';
import { DashBoardItemModel } from '../../../logic/dash-board/dash-board-state.model';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';

@Component({
  selector: 'vehicle-item',
  templateUrl: './vehicle-item.component.html'
})
export class VehicleItemComponent {
  @Input()
  data: DashBoardItemModel;
  dropDownData: Array<string> = Object.values(VehicleEnum);

  constructor(private container: VehicleContainerManagerService) {}

  RemoveContainer() {
    this.container.removeContainer(this.data);
  }
  AddVehicle(vehicle: string): void {
    console.log(vehicle);
  }
}
