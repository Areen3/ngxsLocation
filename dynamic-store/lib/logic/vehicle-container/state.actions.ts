import { BaseActionWithPayload } from '../../model/store/actions';
import { VehicleEnum } from '../../model/domain/vehicle.enum';

enum VehicleContainerActionType {
  addContainer = '[vehicle-container] add container',
  removeContainer = '[vehicle-container] remove container',
  add = '[vehicle] add',
  remove = '[vehicle] remove'
}

export class AddVehicleContainerAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.addContainer;
}

export class RemoveVehicleContainerAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.removeContainer;
}

interface VehicleActionData {
  vehicle: VehicleEnum;
  id: number;
  location: string;
}
export class AddVehicleAction extends BaseActionWithPayload<VehicleActionData> {
  static readonly type = VehicleContainerActionType.add;
}

export class RemoveVehicleAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.remove;
}
