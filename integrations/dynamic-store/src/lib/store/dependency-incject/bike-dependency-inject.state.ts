import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/enums/vehicle.enum';
import { BikeModel } from '../../model/domain/bike.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import { BikeVehicleSpeedService } from '../services/bike-vehicle-speed.service';
import { MuscleMultiplierService } from '../services/muscle-multiplier.service';
import { VehicleDependencyInjectState } from './vehicle-dependency-inject.state';

@State<VehicleStateModel<BikeModel>>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleBike),
  defaults: {
    model: { name: '', type: VehicleEnum.motorBike, speed: 0, seats: 1 },
    elements: { id: 0, location: '', name: '' },
    view: { remove: false }
  },
  creationMode: {
    providers: [
      { provide: BikeDependencyInjectState },
      { provide: AbstractVehicleSpeedService, useClass: BikeVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MuscleMultiplierService }
    ]
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dependencyInjectedStore, VehicleEnum.bike)
export class BikeDependencyInjectState extends VehicleDependencyInjectState<BikeModel> {}
