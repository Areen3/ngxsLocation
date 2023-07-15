import { Injectable, Self } from '@angular/core';
import { NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { FormModelSingleResponsibilityState } from '../base/form-model-single-responsibility-state.service';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleAccessModel } from '../../../model/store/host-area.model';
import { VehicleModel } from '../../../model/domain/vehicle.model';
import { VehicleItemStupidModelModel } from '../../../model/stupid/vehicle-item-stupid.model';
import { VehicleEnum } from '../../../model/enums/vehicle.enum';
import { registerSelectorVehicleMethod } from '../../../model/decorators/register-selector-vehicle-method.decorator';
import { AbstractVehicleSpeedService } from '../../../model/abstract/abstract-vehicle-speed.service';

@State<VehicleModel>({
  name: StateNamesEnum.formModel,
  defaults: { speed: 0, type: VehicleEnum.selectVehicle, name: '' }
})
@Injectable()
export class FormModelVehicleStateService<T extends VehicleModel>
  extends FormModelSingleResponsibilityState<T, HostVehicleAccessModel>
  implements NgxsOnInit
{
  constructor(
    @Self() protected readonly host: HostAreaAccessService<HostVehicleAccessModel>,
    protected readonly speedSrv: AbstractVehicleSpeedService<T>
  ) {
    super(host);
  }

  @Selector()
  @registerSelectorVehicleMethod('')
  static formModel$(state: VehicleModel): VehicleItemStupidModelModel {
    return {
      vehicle: state
    };
  }

  ngxsOnInit(ctx: StateContext<T>) {
    super.ngxsOnInit(ctx);
    const data = this.speedSrv.getEmptyModel();
    ctx.patchState({ ...data });
  }
}
