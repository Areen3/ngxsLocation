import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../../model/stupid/dash-board-stupid.model';
import { DashBoardEvents, DashBoardEventType } from './dash-board.event';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';

@Component({
  selector: 'dashboard-stupid',
  templateUrl: './dash-board-stupid.component.html',
  styleUrls: ['./dash-board-stupid.component.scss']
})
export class DashBoardStupidComponent {
  @Input()
  data: DashBoardStupidDataModel;
  @Input()
  metaData: DashBoardStupidMetaDataModel;
  @Output()
  eventEmitter: EventEmitter<DashBoardEvents> = new EventEmitter<DashBoardEvents>();
  isDisabled = true;

  constructor() {}

  AddContainer(type: string) {
    this.eventEmitter.emit({
      eventType: DashBoardEventType.addContainer,
      data: <VehicleContainerEnum>type
    });
  }

  onSelected(value: string) {
    this.isDisabled = value === VehicleContainerEnum.selectStoreType;
  }
}
