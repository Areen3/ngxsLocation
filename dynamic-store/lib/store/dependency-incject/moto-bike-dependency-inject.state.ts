import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { MotorBikeVehicleSpeedService } from '../../logic/services/motor-bike-vehicle-speed.service';
import { MechanicalMultiplierService } from '../../logic/services/mechanical-multiplier.service';
import { VehicleDependencyInjectState } from './vehicle-dependency-inject.state';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

@State<VehicleStateModel<VehicleModel>>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleMotoBike),
  defaults: {
    data: { name: '', type: VehicleEnum.motorBike, speed: 0 },
    context: { id: 0, location: '' },
    metaData: { remove: false }
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
