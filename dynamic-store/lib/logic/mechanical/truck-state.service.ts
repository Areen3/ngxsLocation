import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AbstractVehicleSpeedService } from '../../model/abstract/abstract-vehicle-speed.service';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { VehicleState } from '../base/vehicle.state';
import { VehicleStateModel } from '../base/vehicle-state.model';
import { VehicleModel } from '../../model/domain/vehicle.model';
import { TruckVehicleSpeedService } from '../services/truck-vehicle-speed.service';
import { registerState } from '../../model/decorators/register-state.decorator';

@State<VehicleStateModel<VehicleModel>>({
  name: StateNamesEnum.vehicle,
  defaults: {
    data: {
      name: '',
      type: VehicleEnum.truck,
      speed: 0
    }
  },
  creationMode: {
    providers: [{ provide: AbstractVehicleSpeedService, useClass: TruckVehicleSpeedService }]
  }
})
@Injectable()
@registerState(VehicleEnum.truck)
export class TruckStateService extends VehicleState<VehicleModel> {}
