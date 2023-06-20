import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { VehicleItemEvents, VehicleItemEventType } from './vehicle-item.event';
import {
  VehicleItemStupidMetaDataModel,
  VehicleItemStupidDataModel
} from '../../../model/stupid/vehicle-item-stupid.model';

@Component({
  selector: 'vehicle-item-stupid',
  templateUrl: './vehicle-item-stupid.component.html',
  styleUrls: ['./vehicle-item-stupid.component.scss']
})
export class VehicleItemStupidComponent {
  @Input()
  context: VehicleItemModel;
  @Input()
  data: VehicleItemStupidDataModel;
  @Input()
  metaData: VehicleItemStupidMetaDataModel;
  @Output()
  eventEmitter: EventEmitter<VehicleItemEvents> = new EventEmitter<VehicleItemEvents>();

  ChangeSpeed(): void {
    this.eventEmitter.emit({ eventType: VehicleItemEventType.changeSpeed, data: {} });
  }

  RemoveVehicle(): void {
    this.eventEmitter.emit({
      eventType: VehicleItemEventType.removeVehicle,
      data: this.context
    });
  }
}
