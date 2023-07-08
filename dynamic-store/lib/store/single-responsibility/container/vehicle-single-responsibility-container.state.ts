import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';
import { StateBuildersUtils } from '../../../logic/utils/state-builders.utils';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { RoutingSingleResponsibilityState } from '../base/routing-single-responsibility.state';
import { registerContainerState } from '../../../model/decorators/register-container-state.decorator';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import { FormDataVehicleContainerState } from './form-data-vehicle-container.state';
import { FormMetaDataVehicleContainerState } from './form-meta-data-vehicle-container.state';
import { FormContextVehicleContainerState } from './form-context-vehicle-container.state';

@State<IEmptyObject>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleContainer),
  defaults: {},
  creationMode: {
    providers: [
      { provide: VehicleSingleResponsibilityContainerState },
      { provide: FormContextVehicleContainerState },
      { provide: FormDataVehicleContainerState },
      { provide: FormMetaDataVehicleContainerState },
      { provide: RoutingSingleResponsibilityState }
    ],
    newInstance: true
  },
  children: [
    FormContextVehicleContainerState,
    FormDataVehicleContainerState,
    FormMetaDataVehicleContainerState,
    RoutingSingleResponsibilityState
  ]
})
@registerContainerState(VehicleContainerEnum.singleResponsibilityStore)
@Injectable()
export class VehicleSingleResponsibilityContainerState {}
