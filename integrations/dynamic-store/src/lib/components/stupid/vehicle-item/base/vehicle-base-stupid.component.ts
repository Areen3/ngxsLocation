import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { VehicleItemModel } from '../../../../model/store/vehicle-item.model';
import { VehicleItemEvents, VehicleItemEventType } from './vehicle-item.event';
import {
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../../../model/stupid/vehicle-item-stupid.model';
import {
  BaseStupidElementsInterface,
  BaseStupidInputInterface,
  BaseStupidOutputInterface
} from '../../base/base-stupid-input-interface';

@Directive({
  selector: 'vehicle-base-stupid'
})
export class VehicleBaseStupidComponent<
  TEvents extends VehicleItemEvents,
  TModel extends VehicleItemStupidModelModel,
  TView extends VehicleItemStupidViewModel,
  TElements extends VehicleItemModel = VehicleItemModel
> implements
    BaseStupidInputInterface<TModel, TView>,
    BaseStupidOutputInterface<TEvents>,
    BaseStupidElementsInterface<TElements>
{
  @Input()
  elements: TElements;
  @Input()
  model: TModel;
  @Input()
  view: TView;
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
      data: this.elements
    });
  }
}
