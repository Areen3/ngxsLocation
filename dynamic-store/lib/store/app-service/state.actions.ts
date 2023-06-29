import { BaseActionWithPayload } from '../../model/store/actions';
import { DashBoardContextItemModel } from '../../logic/dash-board/dash-board-state.model';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

enum VehicleAppActionType {
  addContainer = '[vehicle-app-store] add vehicle container',
  removeContainer = '[vehicle-app-store] remove vehicle container',
  addBackendContainer = '[vehicle-app-store] add backend vehicle container',
  removeBackendContainer = '[vehicle-app-store] remove backend vehicle container',
  addVehicle = '[vehicle-app-store] add vehicle',
  removeVehicle = '[vehicle-app-store] remove vehicle',
  changeSpeed = '[vehicle-app-store] change speed'
}

export class AddVehicleContainerAppServiceAction extends BaseActionWithPayload<VehicleContainerEnum> {
  static readonly type = VehicleAppActionType.addContainer;
}

export class RemoveVehicleContainerAppServiceAction extends BaseActionWithPayload<DashBoardContextItemModel> {
  static readonly type = VehicleAppActionType.removeContainer;
}

export class AddVehicleBackendContainerAppServiceAction extends BaseActionWithPayload<VehicleContainerEnum> {
  static readonly type = VehicleAppActionType.addBackendContainer;
}

export class RemoveVehicleBackendContainerAppServiceAction extends BaseActionWithPayload<DashBoardContextItemModel> {
  static readonly type = VehicleAppActionType.removeBackendContainer;
}

export class AddVehicleAppServiceAction extends BaseActionWithPayload<{
  container: DashBoardContextItemModel;
  vehicle: VehicleEnum;
}> {
  static readonly type = VehicleAppActionType.addVehicle;
}

export class RemoveVehicleAppServiceAction extends BaseActionWithPayload<VehicleItemModel> {
  static readonly type = VehicleAppActionType.removeVehicle;
}

export class ChangeSpeedAppServiceAction extends BaseActionWithPayload<VehicleItemModel> {
  static readonly type = VehicleAppActionType.changeSpeed;
}
