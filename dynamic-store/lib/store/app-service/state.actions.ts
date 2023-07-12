import { BaseActionWithPayload } from '../../model/store/actions';
import { DashBoardContextItemModel } from '../../logic/dash-board/dash-board-state.model';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

enum VehicleAppActionType {
  addContainer = '[vehicle-app-store] add vehicle container',
  removeContainer = '[vehicle-app-store] remove vehicle container',
  addVehicle = '[vehicle-app-store] add vehicle',
  removeVehicle = '[vehicle-app-store] remove vehicle',
  changeSpeed = '[vehicle-app-store] change speed',
  loadVehicleContainer = '[vehicle-app-store] load vehicle container'
}

export class AddVehicleContainerAppServiceAction extends BaseActionWithPayload<{
  vehicle: VehicleContainerEnum;
  withStore: boolean;
}> {
  static readonly type = VehicleAppActionType.addContainer;
}

export class RemoveVehicleContainerAppServiceAction extends BaseActionWithPayload<DashBoardContextItemModel> {
  static readonly type = VehicleAppActionType.removeContainer;
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

export class LoadVehicleContainerAppServiceAction extends BaseActionWithPayload<DashBoardContextItemModel> {
  static readonly type = VehicleAppActionType.loadVehicleContainer;
}
