import { BaseEventsAbstract } from '../../../model/events/base.event';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import { DashBoardContextItemModel } from '../../../logic/dash-board/dash-board-state.model';

export enum VehicleContainerEventType {
  addVehicle = 'addVehicle',
  removeContainer = 'removeContainer'
}

export type VehicleContainerAddVehicleEvent = BaseEventsAbstract<
  VehicleContainerEventType,
  VehicleEnum
>;
export type VehicleContainerRemoveContainerEvent = BaseEventsAbstract<
  VehicleContainerEventType,
  DashBoardContextItemModel
>;
export type VehicleContainerEvents =
  | VehicleContainerAddVehicleEvent
  | VehicleContainerRemoveContainerEvent;
