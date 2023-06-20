import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidMetaDataModel
} from '../../../model/stupid/vehicle-container-stupid.model';
import { VehicleContainerEvents, VehicleContainerEventType } from './vehicle-container.event';
import { DashBoardContextItemModel } from '../../../logic/dash-board/dash-board-state.model';

@Component({
  selector: 'vehicle-container-stupid',
  templateUrl: './vehicle-container-stupid.component.html',
  styleUrls: ['./vehicle-container-stupid.component.scss']
})
export class VehicleContainerStupidComponent {
  @Input()
  context: DashBoardContextItemModel;
  @Input()
  data: VehicleContainerStupidDataModel;
  @Input()
  metaData: VehicleContainerStupidMetaDataModel;
  @Output()
  eventEmitter: EventEmitter<VehicleContainerEvents> =
    new EventEmitter<VehicleContainerEvents>();
  isDisabled = true;

  RemoveContainer() {
    this.eventEmitter.emit({
      eventType: VehicleContainerEventType.removeContainer,
      data: this.context
    });
  }

  AddVehicle(vehicle: string): void {
    this.eventEmitter.emit({
      eventType: VehicleContainerEventType.addVehicle,
      data: <VehicleEnum>vehicle
    });
  }

  onSelectedVehicle(value: string) {
    this.isDisabled = value === VehicleEnum.selectVehicle;
  }
}
