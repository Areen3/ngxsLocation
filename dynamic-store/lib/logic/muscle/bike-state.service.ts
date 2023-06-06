import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { BikeVehicleSpeedService } from '../services/bike-vehicle-speed.service';
import { VehicleState } from '../base/vehicle.state';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { BikeModel } from '../../model/domain/bike.model';
import { registerState } from '../../model/decorators/register-state.decorator';

@State<VehicleStateModel<BikeModel>>({
  name: StateNamesEnum.vehicle,
  defaults: {
    data: {
      name: '',
      type: VehicleEnum.bike,
      speed: 0,
      seats: 1
    }
  },
  creationMode: {
    providers: [{ provide: AbstractVehicleSpeedService, useClass: BikeVehicleSpeedService }]
  }
})
@Injectable()
@registerState(VehicleEnum.bike)
export class BikeStateService extends VehicleState<BikeModel> {}
