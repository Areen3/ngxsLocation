import { BaseEventsAbstract } from '../../../model/events/base.event';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import { DashBoardElementsItemModel } from '../../../logic/dash-board/dash-board-state.model';

export enum VehicleContainerEventType {
  addVehicle = 'addVehicle',
  removeContainer = 'removeContainer'
}

export type VehicleContainerAddVehicleEvent = BaseEventsAbstract<
  VehicleContainerEventType.addVehicle,
  VehicleEnum
>;
export type VehicleContainerRemoveContainerEvent = BaseEventsAbstract<
  VehicleContainerEventType.removeContainer,
  DashBoardElementsItemModel
>;
export type VehicleContainerEvents =
  | VehicleContainerAddVehicleEvent
  | VehicleContainerRemoveContainerEvent;
