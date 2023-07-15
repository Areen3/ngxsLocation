import { Injectable, Self } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { VehicleEnum } from '../../../model/enums/vehicle.enum';
import { AbstractVehicleSpeedService } from '../../../model/abstract/abstract-vehicle-speed.service';
import { AbstractSpeedMultiplierService } from '../../../model/abstract/abstract-speed-multiplier-.service';
import { registerVehicleState } from '../../../model/decorators/register-vehicle-state.decorator';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import { IEmptyObject } from '../../../model/base/base';
import { VehicleSingleResponsibilityState } from './vehicle-single-responsibility.state';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleAccessModel } from '../../../model/store/host-area.model';
import { FormModelVehicleStateService } from './form-model-vehicle-state.service';
import { FormViewVehicleStateService } from './form-view-vehicle-state.service';
import { SpeedSrVehicleState } from './speed-sr-vehicle.state';
import { StateBuildersUtils } from '../../utils/state-builders.utils';
import { BikeVehicleSpeedService } from '../../services/bike-vehicle-speed.service';
import { MuscleMultiplierService } from '../../services/muscle-multiplier.service';

@State<IEmptyObject>({
  name: StateBuildersUtils.buildSingleResponsibilityStateName(StateNamesEnum.vehicleBike),
  defaults: {},
  creationMode: {
    providers: [
      { provide: BikeSingleResponsibilityState },
      { provide: AbstractVehicleSpeedService, useClass: BikeVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MuscleMultiplierService },
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
@registerVehicleState(VehicleContainerEnum.singleResponsibilityStore, VehicleEnum.bike)
export class BikeSingleResponsibilityState extends VehicleSingleResponsibilityState {
  constructor(@Self() protected readonly host: HostAreaAccessService<HostVehicleAccessModel>) {
    super();
  }
}
