import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { CarVehicleSpeedService } from '../../logic/services/car-vehicle-speed.service';
import { MechanicalMultiplierService } from '../../logic/services/mechanical-multiplier.service';
import { VehicleDependencyInjectState } from './vehicle-dependency-inject.state';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

@State<VehicleStateModel<VehicleModel>>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleCar),
  defaults: {
    data: { name: '', type: VehicleEnum.car, speed: 0 },
    context: { id: 0, location: '' },
    metaData: { remove: false }
  },
  creationMode: {
    providers: [
      { provide: CarDependencyInjectState },
      { provide: AbstractVehicleSpeedService, useClass: CarVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MechanicalMultiplierService }
    ],
    newInstance: true
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dependencyInjectedStore, VehicleEnum.car)
export class CarDependencyInjectState<
  T extends VehicleModel = VehicleModel
> extends VehicleDependencyInjectState<T> {}
