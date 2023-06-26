import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { registerVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { VehicleStateModel } from '../../logic/base/vehicle-state.model';
import { TruckVehicleSpeedService } from '../../logic/services/truck-vehicle-speed.service';
import { MechanicalMultiplierService } from '../../logic/services/mechanical-multiplier.service';
import { VehicleDependencyInjectState } from './vehicle-dependency-inject.state';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

@State<VehicleStateModel<VehicleModel>>({
  name: StateBuildersUtils.buildDependencyInjectStateName(StateNamesEnum.vehicleTruck),
  defaults: {
    data: { name: '', type: VehicleEnum.truck, speed: 0 },
    context: { id: 0, location: '' },
    metaData: { remove: false }
  },
  creationMode: {
    providers: [
      { provide: TruckDependencyInjectState },
      { provide: AbstractVehicleSpeedService, useClass: TruckVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MechanicalMultiplierService }
    ],
    newInstance: true
  }
})
@Injectable()
@registerVehicleState(VehicleContainerEnum.dependencyInjectedStore, VehicleEnum.truck)
export class TruckDependencyInjectState extends VehicleDependencyInjectState<VehicleModel> {}
