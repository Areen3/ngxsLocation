import { BaseActionWithPayload } from '../../model/store/actions';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { ElementLocationModel, ElementNameModel, IEntity } from '../../model/base/base';
import { DashBoardContextItemModel } from '../dash-board/dash-board-state.model';

enum VehicleContainerActionType {
  addContainer = '[vehicle-container] add container',
  removeContainer = '[vehicle-container] remove container',
  setCountContainers = '[vehicle] set count containers ',
  add = '[vehicle] add',
  remove = '[vehicle] remove'
}

export class AddVehicleContainerAction extends BaseActionWithPayload<DashBoardContextItemModel> {
  static readonly type = VehicleContainerActionType.addContainer;
}

export class RemoveVehicleContainerAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.removeContainer;
}

export class SetCountContainerAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.setCountContainers;
}

interface VehicleActionData extends IEntity, ElementLocationModel, ElementNameModel {
  vehicle: VehicleEnum;
}
export class AddVehicleAction extends BaseActionWithPayload<VehicleActionData> {
  static readonly type = VehicleContainerActionType.add;
}

export class RemoveVehicleAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.remove;
}
