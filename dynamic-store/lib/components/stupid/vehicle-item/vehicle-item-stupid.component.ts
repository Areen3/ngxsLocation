import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { VehicleItemEvents, VehicleItemEventType } from './vehicle-item.event';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidMetaDataModel
} from '../../../model/stupid/vehicle-container-stupid.model';

@Component({
  selector: 'vehicle-item-stupid',
  templateUrl: './vehicle-item-stupid.component.html'
})
export class VehicleItemStupidComponent {
  @Input()
  context: VehicleItemModel;
  @Input()
  data: VehicleContainerStupidDataModel;
  @Input()
  metaData: VehicleContainerStupidMetaDataModel;
  @Output()
  eventEmitter: EventEmitter<VehicleItemEvents> = new EventEmitter<VehicleItemEvents>();

  ChangeSpeed(): void {
    //const newSpeed = Math.floor(Math.random() * 100);
    this.eventEmitter.emit({ eventType: VehicleItemEventType.changeSpeed, data: {} });
  }

  RemoveVehicle(): void {
    this.eventEmitter.emit({
      eventType: VehicleItemEventType.removeVehicle,
      data: this.context
    });
  }
}
