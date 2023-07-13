import { Injectable, Self } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormViewSingleResponsibilityState } from '../base/form-view-single-responsibility-state.service';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleAccessModel } from '../../../model/store/host-area.model';
import { VehicleItemViewModel } from '../../../logic/base/vehicle-state.model';
import { registerSelectorVehicleMethod } from '../../../model/decorators/register-selector-vehicle-method.decorator';
import { VehicleItemStupidViewModel } from '../../../model/stupid/vehicle-item-stupid.model';

@State<VehicleItemViewModel>({
  name: StateNamesEnum.formView,
  defaults: { remove: false }
})
@Injectable()
export class FormViewVehicleStateService extends FormViewSingleResponsibilityState<
  VehicleItemViewModel,
  HostVehicleAccessModel
> {
  constructor(@Self() protected readonly host: HostAreaAccessService<HostVehicleAccessModel>) {
    super(host);
  }

  @Selector()
  @registerSelectorVehicleMethod('')
  static formView$(_state: VehicleItemViewModel): VehicleItemStupidViewModel {
    return {};
  }
}
