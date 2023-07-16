import { HostSingleResponsibilityAreaAccessModel } from './base-simple-store.model';
import { ElementsDataModel } from '../domain/elementDataModel';
import { VehicleItemModel } from './vehicle-item.model';
import { VehicleModel } from '../domain/vehicle.model';
import {
  VehicleContainerModelModel,
  VehicleContainerViewModel
} from '../../store/base/vehicle-container-state.model';
import { VehicleItemViewModel } from '../../store/base/vehicle-state.model';

export type HostVehicleContainerAccessModel = HostSingleResponsibilityAreaAccessModel<
  VehicleContainerModelModel,
  VehicleContainerViewModel,
  ElementsDataModel<VehicleItemModel>
>;

export type HostVehicleAccessModel = HostSingleResponsibilityAreaAccessModel<
  VehicleModel,
  VehicleItemViewModel,
  ElementsDataModel<VehicleItemModel>
>;
