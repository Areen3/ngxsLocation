import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/enums/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import { MotorBikeVehicleSpeedService } from '../services/motor-bike-vehicle-speed.service';
import { MechanicalMultiplierService } from '../services/mechanical-multiplier.service';
import { VehicleDependencyInjectState } from './vehicle-dependency-inject.state';

@State<VehicleStateModel<VehicleModel>>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleMotoBike),
  defaults: {
    model: { name: '', type: VehicleEnum.motorBike, speed: 0 },
    elements: { id: 0, location: '', name: '' },
    view: { remove: false }
  },
  creationMode: {
    providers: [
      { provide: MotoBikeDependencyInjectState },
      { provide: AbstractVehicleSpeedService, useClass: MotorBikeVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MechanicalMultiplierService }
    ]
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dependencyInjectedStore, VehicleEnum.motorBike)
export class MotoBikeDependencyInjectState extends VehicleDependencyInjectState<VehicleModel> {}
