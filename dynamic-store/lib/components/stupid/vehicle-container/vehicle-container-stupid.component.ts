import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidMetaDataModel
} from '../../../model/stupid/vehicle-container-stupid.model';
import { VehicleContainerEvents, VehicleContainerEventType } from './vehicle-container.event';
import { DashBoardContextItemModel } from '../../../logic/dash-board/dash-board-state.model';
import {
  BaseStupidContextInterface,
  BaseStupidInputInterface,
  BaseStupidOutputInterface
} from '../base/base-stupid-input-interface';

@Component({
  selector: 'vehicle-container-stupid',
  templateUrl: './vehicle-container-stupid.component.html',
  styleUrls: ['./vehicle-container-stupid.component.scss']
})
export class VehicleContainerStupidComponent<
  TEvents extends VehicleContainerEvents,
  TModel = VehicleContainerStupidDataModel,
  TView = VehicleContainerStupidMetaDataModel,
  TElements extends DashBoardContextItemModel = DashBoardContextItemModel
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
  isDisabled = true;

  RemoveContainer() {
    this.eventEmitter.emit(<TEvents>{
      eventType: VehicleContainerEventType.removeContainer,
      data: <DashBoardContextItemModel>this.context
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
