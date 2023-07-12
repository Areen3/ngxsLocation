import { HostSingleResponsibilityAreaAccessModel } from './base-simple-store.model';
import {
  VehicleContainerModelModel,
  VehicleContainerViewModel
} from '../../logic/vehicle-container/vehicle-container-state.model';
import { ElementsDataModel } from '../domain/elementDataModel';
import { VehicleItemModel } from './vehicle-item.model';

export type HostVehicleContainerAccessModel = HostSingleResponsibilityAreaAccessModel<
  VehicleContainerModelModel,
  VehicleContainerViewModel,
  ElementsDataModel<VehicleItemModel>
>;
