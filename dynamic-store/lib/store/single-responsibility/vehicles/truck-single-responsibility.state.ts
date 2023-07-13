import { Injectable, Self } from '@angular/core';
import { State } from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleAccessModel } from '../../../model/store/host-area.model';
import { StateBuildersUtils } from '../../../logic/utils/state-builders.utils';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../../model/abstract/abstract-vehicle-speed.service';
import { TruckVehicleSpeedService } from '../../../logic/services/truck-vehicle-speed.service';
import { AbstractSpeedMultiplierService } from '../../../model/abstract/abstract-speed-multiplier-.service';
import { MechanicalMultiplierService } from '../../../logic/services/mechanical-multiplier.service';
import { registerVehicleState } from '../../../model/decorators/register-vehicle-state.decorator';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import { VehicleSingleResponsibilityState } from './vehicle-single-responsibility.state';
import { FormModelVehicleStateService } from './form-model-vehicle-state.service';
import { FormViewVehicleStateService } from './form-view-vehicle-state.service';
import { SpeedSrVehicleState } from './speed-sr-vehicle.state';

@State<IEmptyObject>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleTruck),
  defaults: {},
  creationMode: {
    providers: [
      { provide: TruckSingleResponsibilityState },
      { provide: AbstractVehicleSpeedService, useClass: TruckVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MechanicalMultiplierService },
      { provide: HostAreaAccessService },
      { provide: FormModelVehicleStateService },
      { provide: FormViewVehicleStateService },
      { provide: SpeedSrVehicleState }
    ],
    newInstance: true
  },
  children: [FormModelVehicleStateService, FormViewVehicleStateService, SpeedSrVehicleState]
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.singleResponsibilityStore, VehicleEnum.truck)
export class TruckSingleResponsibilityState extends VehicleSingleResponsibilityState {
  constructor(@Self() protected readonly host: HostAreaAccessService<HostVehicleAccessModel>) {
    super();
  }
}
