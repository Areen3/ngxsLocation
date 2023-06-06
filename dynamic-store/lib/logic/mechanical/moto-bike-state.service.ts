import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleState } from '../base/vehicle.state';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { MotorBikeVehicleSpeedService } from '../services/motor-bike-vehicle-speed.service';
import { registerState } from '../../model/decorators/register-state.decorator';

@State<VehicleStateModel<VehicleModel>>({
  name: StateNamesEnum.vehicle,
  defaults: {
    data: {
      name: '',
      type: VehicleEnum.motorBike,
      speed: 0
    }
  },
  creationMode: {
    providers: [
      { provide: AbstractVehicleSpeedService, useClass: MotorBikeVehicleSpeedService }
    ]
  }
})
@Injectable()
@registerState(VehicleEnum.motorBike)
export class MotoBikeStateService extends VehicleState<VehicleModel> {}
