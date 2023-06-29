import { BaseEventsAbstract } from '../../../model/events/base.event';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';

export enum DashBoardEventType {
  addContainer = 'addContainer',
  simulateUsers = 'simulateUsers'
}

export type DashBoardAddContainerEvent = BaseEventsAbstract<
  DashBoardEventType,
  VehicleContainerEnum
>;
export type DashBoardSimulateUsersEvent = BaseEventsAbstract<DashBoardEventType, boolean>;

export type DashBoardEvents = DashBoardAddContainerEvent | DashBoardSimulateUsersEvent;
