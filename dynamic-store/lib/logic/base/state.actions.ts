import { BaseActionWithPayload } from '../../model/store/actions';
import { VehicleModel } from '../../model/domain/vehicle.model';

enum VehicleActionType {
  update = '[vehicle] update',
  changeSpeed = '[vehicle] changeSpeed'
}

export class UpdateVehicleAction extends BaseActionWithPayload<
  Pick<VehicleModel, 'type' | 'name'>
> {
  static readonly type = VehicleActionType.update;
}

export class changeSpeedVehicleAction extends BaseActionWithPayload<number> {
  static readonly type = VehicleActionType.changeSpeed;
}
