import { BaseEventsAbstract } from '../../../model/events/base.event';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';

export enum VehicleItemEventType {
  changeSpeed = 'VehicleModel',
  removeVehicle = 'removeVehicle'
}

export type VehicleItemRemoveVehicleEvent = BaseEventsAbstract<
  VehicleItemEventType,
  VehicleItemModel
>;
export type VehicleItemChangeSpeedEvent = BaseEventsAbstract<VehicleItemEventType>;
export type VehicleItemEvents = VehicleItemRemoveVehicleEvent | VehicleItemChangeSpeedEvent;
