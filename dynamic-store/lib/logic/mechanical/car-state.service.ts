import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleState } from '../base/vehicle.state';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { CarVehicleSpeedService } from '../services/car-vehicle-speed.service';
import { registerState } from '../../model/decorators/register-state.decorator';
import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { MechanicalMultiplierService } from '../services/mechanical-multiplier.service';

@State<VehicleStateModel<VehicleModel>>({
  name: StateNamesEnum.vehicleCar,
  defaults: {
    data: {
      name: '',
      type: VehicleEnum.car,
      speed: 0
    }
  },
  creationMode: {
    providers: [
      { provide: CarStateService },
      { provide: AbstractVehicleSpeedService, useClass: CarVehicleSpeedService },
      { provide: AbstractSpeedMultiplierService, useClass: MechanicalMultiplierService }
    ],
    newInstance: true
  }
})
@Injectable()
@registerState(VehicleEnum.car)
export class CarStateService<T extends VehicleModel = VehicleModel> extends VehicleState<T> {}
