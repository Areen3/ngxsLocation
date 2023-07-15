import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleEnum } from '../../../model/enums/vehicle.enum';
import {
  VehicleContainerStupidModelModel,
  VehicleContainerStupidViewModel
} from '../../../model/stupid/vehicle-container-stupid.model';
import { VehicleContainerEvents, VehicleContainerEventType } from './vehicle-container.event';
import {
  BaseStupidElementsInterface,
  BaseStupidInputInterface,
  BaseStupidOutputInterface
} from '../base/base-stupid-input-interface';
import { DashBoardElementsItemModel } from '../../../store/dash-board/dash-board-state.model';

@Component({
  selector: 'vehicle-container-stupid',
  templateUrl: './vehicle-container-stupid.component.html',
  styleUrls: ['./vehicle-container-stupid.component.scss']
})
export class VehicleContainerStupidComponent<
  TEvents extends VehicleContainerEvents,
  TModel = VehicleContainerStupidModelModel,
  TView = VehicleContainerStupidViewModel,
  TElements extends DashBoardElementsItemModel = DashBoardElementsItemModel
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
  isDisabled = true;

  RemoveContainer() {
    this.eventEmitter.emit(<TEvents>{
      eventType: VehicleContainerEventType.removeContainer,
      data: <DashBoardElementsItemModel>this.elements
    });
  }

  AddVehicle(vehicle: string): void {
    this.eventEmitter.emit(<TEvents>{
      eventType: VehicleContainerEventType.addVehicle,
      data: <VehicleEnum>vehicle
    });
  }

  onSelectedVehicle(value: string) {
    this.isDisabled = value === VehicleEnum.selectVehicle;
  }
}
