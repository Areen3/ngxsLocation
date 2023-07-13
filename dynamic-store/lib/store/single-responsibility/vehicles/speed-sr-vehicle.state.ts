import { Injectable, Self } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { IEmptyObject } from '../../../model/base/base';
import { BaseSingleResponsibilityState } from '../base/base-single-responsibility.state';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleAccessModel } from '../../../model/store/host-area.model';
import { Observable } from 'rxjs';
import { UpdateModelAction } from '../base/data-state.actions';
import { ChangeSpeedVehicleAction } from '../../../logic/base/state.actions';
import { VehicleStateModel } from '../../../logic/base/vehicle-state.model';
import { VehicleModel } from '../../../model/domain/vehicle.model';

@State<IEmptyObject>({
  name: StateNamesEnum.speedSrState,
  defaults: {}
})
@Injectable()
export class SpeedSrVehicleState extends BaseSingleResponsibilityState<HostVehicleAccessModel> {
  constructor(
    private readonly store: Store,
    @Self() protected readonly host: HostAreaAccessService<HostVehicleAccessModel>
  ) {
    super(host);
  }

  @Action(ChangeSpeedVehicleAction)
  changeSpeedVehicleAction(
    ctx: StateContext<VehicleStateModel>,
    action: ChangeSpeedVehicleAction
  ): Observable<any> {
    return this.store.dispatchInLocation(
      new UpdateModelAction<Partial<VehicleModel>>({
        speed: action.payload
      }),
      ctx.getLocation().getNeighborLocation(StateNamesEnum.formModel)
    );
  }
}
