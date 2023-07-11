import { HostSingleResponsibilityAreaAccessModel } from './base-simple-store.model';
import {
  VehicleContainerDataModel,
  VehicleContainerMetaDataModel
} from '../../logic/vehicle-container/vehicle-container-state.model';
import { ElementsDataModel } from '../domain/elementDataModel';
import { VehicleItemModel } from './vehicle-item.model';

export type HostVehicleContainerAccessModel = HostSingleResponsibilityAreaAccessModel<
  VehicleContainerDataModel,
  VehicleContainerMetaDataModel,
  ElementsDataModel<VehicleItemModel>
>;
