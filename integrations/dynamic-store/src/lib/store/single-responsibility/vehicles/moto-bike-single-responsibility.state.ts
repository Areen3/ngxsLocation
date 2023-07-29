import { Injectable, Self } from '@angular/core';
import { State } from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';
import { VehicleSingleResponsibilityState } from './vehicle-single-responsibility.state';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { AbstractVehicleSpeedService } from '../../../model/abstract/abstract-vehicle-speed.service';
import { AbstractSpeedMultiplierService } from '../../../model/abstract/abstract-speed-multiplier-.service';
import { registerVehicleState } from '../../../model/decorators/register-vehicle-state.decorator';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import { VehicleEnum } from '../../../model/enums/vehicle.enum';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleAccessModel } from '../../../model/store/host-area.model';
import { FormModelVehicleStateService } from './form-model-vehicle-state.service';
import { FormViewVehicleStateService } from './form-view-vehicle-state.service';
import { SpeedSrVehicleState } from './speed-sr-vehicle.state';
import { MotorBikeVehicleSpeedService } from '../../services/motor-bike-vehicle-speed.service';
import { StateBuildersUtils } from '../../utils/state-builders.utils';
import { MechanicalMultiplierService } from '../../services/mechanical-multiplier.service';

@State<IEmptyObject>({
  name: StateBuildersUtils.buildSingleResponsibilityStateName(StateNamesEnum.vehicleMotoBike),
  defaults: {},
  creationMode: {
    providers: [
      { provide: MotoBikeSingleResponsibilityState },
      { provide: AbstractVehicleSpeedService, useClass: MotorBikeVehicleSpeedService },
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
@registerVehicleState(VehicleContainerEnum.singleResponsibilityStore, VehicleEnum.motorBike)
export class MotoBikeSingleResponsibilityState extends VehicleSingleResponsibilityState {
  constructor(@Self() protected readonly host: HostAreaAccessService<HostVehicleAccessModel>) {
    super();
  }
}