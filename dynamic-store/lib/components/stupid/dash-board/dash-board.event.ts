import { BaseEventsAbstract } from '../../../model/events/base.event';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';

export enum DashBoardEventType {
  addContainer = 'addContainer'
}

export type DashBoardAddContainerEvent = BaseEventsAbstract<
  DashBoardEventType,
  VehicleContainerEnum
>;
export type DashBoardEvents = DashBoardAddContainerEvent;
