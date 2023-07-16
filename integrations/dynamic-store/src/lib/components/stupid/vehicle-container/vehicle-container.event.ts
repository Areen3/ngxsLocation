import { BaseEventsAbstract } from '../../../model/base/base.event';
import { VehicleEnum } from '../../../model/enums/vehicle.enum';
import { DashBoardElementsItemModel } from '../../../store/dash-board/dash-board-state.model';

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
