import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { BikeModel } from '../../model/domain/bike.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { BikeVehicleSpeedService } from '../../logic/services/bike-vehicle-speed.service';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { MuscleMultiplierService } from '../../logic/services/muscle-multiplier.service';
import { VehicleDependencyInjectState } from './vehicle-dependency-inject.state';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
@State<VehicleStateModel<BikeModel>>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleBike),
  defaults: {
    data: { name: '', type: VehicleEnum.motorBike, speed: 0, seats: 1 },
    context: { id: 0, location: '' },
    metaData: { remove: false }
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
