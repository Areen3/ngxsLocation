import { BaseActionWithPayload } from '../../model/store/actions';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { IEntity } from '../../model/base/base';
import { DashBoardContextItemModel } from '../dash-board/dash-board-state.model';

enum VehicleContainerActionType {
  addContainer = '[vehicle-container] add container',
  removeContainer = '[vehicle-container] remove container',
  add = '[vehicle] add',
  remove = '[vehicle] remove'
}

export class AddVehicleContainerAction extends BaseActionWithPayload<DashBoardContextItemModel> {
  static readonly type = VehicleContainerActionType.addContainer;
}

export class RemoveVehicleContainerAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.removeContainer;
}

interface VehicleActionData extends IEntity {
  vehicle: VehicleEnum;
  location: string;
}
export class AddVehicleAction extends BaseActionWithPayload<VehicleActionData> {
  static readonly type = VehicleContainerActionType.add;
}

export class RemoveVehicleAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.remove;
}
