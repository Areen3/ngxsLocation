import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../../model/stupid/dash-board-stupid.model';
import { DashBoardEvents, DashBoardEventType } from './dash-board.event';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import {
  BaseStupidInputInterface,
  BaseStupidOutputInterface
} from '../base/base-stupid-input-interface';

@Component({
  selector: 'dashboard-stupid',
  templateUrl: './dash-board-stupid.component.html',
  styleUrls: ['./dash-board-stupid.component.scss']
})
export class DashBoardStupidComponent<
  TModel = DashBoardStupidDataModel,
  TView = DashBoardStupidMetaDataModel,
  TEvents extends DashBoardEvents = DashBoardEvents
> implements BaseStupidInputInterface<TModel, TView>, BaseStupidOutputInterface<TEvents>
{
  @Input()
  data: TModel;
  @Input()
  metaData: TView;
  @Output()
  eventEmitter: EventEmitter<TEvents> = new EventEmitter<TEvents>();
  isDisabled = true;

  constructor() {}

  AddContainer(type: string) {
    this.eventEmitter.emit(<TEvents>{
      eventType: DashBoardEventType.addContainer,
      data: <VehicleContainerEnum>type
    });
  }

  onSelected(value: string) {
    this.isDisabled = value === VehicleContainerEnum.selectStoreType;
  }

  onChange(value: boolean) {
    this.eventEmitter.emit(<TEvents>{
      eventType: DashBoardEventType.simulateUsers,
      data: value
    });
  }
}
