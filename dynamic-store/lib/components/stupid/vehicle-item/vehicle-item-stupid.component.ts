import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { VehicleItemEvents, VehicleItemEventType } from './vehicle-item.event';
import {
  VehicleItemStupidDataModel,
  VehicleItemStupidMetaDataModel
} from '../../../model/stupid/vehicle-item-stupid.model';
import {
  BaseStupidContextInterface,
  BaseStupidInputInterface,
  BaseStupidOutputInterface
} from '../base/base-stupid-input-interface';

@Component({
  selector: 'vehicle-item-stupid',
  templateUrl: './vehicle-item-stupid.component.html',
  styleUrls: ['./vehicle-item-stupid.component.scss']
})
export class VehicleItemStupidComponent<
  TEvents extends VehicleItemEvents,
  TModel = VehicleItemStupidDataModel,
  TView = VehicleItemStupidMetaDataModel,
  TElements extends VehicleItemModel = VehicleItemModel
> implements
    BaseStupidInputInterface<TModel, TView>,
    BaseStupidOutputInterface<TEvents>,
    BaseStupidContextInterface<TElements>
{
  @Input()
  context: TElements;
  @Input()
  data: TModel;
  @Input()
  metaData: TView;
  @Output()
  eventEmitter: EventEmitter<TEvents> = new EventEmitter<TEvents>();

  ChangeSpeed(): void {
    this.eventEmitter.emit(<TEvents>{
      eventType: VehicleItemEventType.changeSpeed,
      data: undefined
    });
  }

  RemoveVehicle(): void {
    this.eventEmitter.emit(<TEvents>{
      eventType: VehicleItemEventType.removeVehicle,
      data: this.context
    });
  }
}
