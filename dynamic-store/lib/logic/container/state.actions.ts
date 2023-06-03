import { BaseActionWithPayload } from '../../model/store/actions';

enum VehicleContainerActionType {
  add = '[vehicle-container] add container',
  remove = '[vehicle-container] remove container'
}

export class AddVehicleContainerAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.add;
}

export class RemoveVehicleContainerAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleContainerActionType.remove;
}
