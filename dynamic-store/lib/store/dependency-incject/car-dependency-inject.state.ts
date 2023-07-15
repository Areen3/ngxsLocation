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
import { CarVehicleSpeedService } from '../services/car-vehicle-speed.service';
import { MechanicalMultiplierService } from '../services/mechanical-multiplier.service';
import { VehicleDependencyInjectState } from './vehicle-dependency-inject.state';

@State<VehicleStateModel<VehicleModel>>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleCar),
  defaults: {
    model: { name: '', type: VehicleEnum.car, speed: 0 },
    elements: { id: 0, location: '', name: '' },
    view: { remove: false }
  },
  creationMode: {
    providers: [
      { provide: CarDependencyInjectState },
      { provide: AbstractVehicleSpeedService, useClass: CarVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MechanicalMultiplierService }
    ]
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dependencyInjectedStore, VehicleEnum.car)
export class CarDependencyInjectState<
  T extends VehicleModel = VehicleModel
> extends VehicleDependencyInjectState<T> {}
