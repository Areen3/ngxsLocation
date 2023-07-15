import { Injectable, Self } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { FormViewSingleResponsibilityState } from '../base/form-view-single-responsibility-state.service';
import { VehicleEnum } from '../../../model/enums/vehicle.enum';
import { registerSelectorVehicleContainerMethod } from '../../../model/decorators/register-selector-vehicle-container-method.decorator';
import { VehicleContainerStupidViewModel } from '../../../model/stupid/vehicle-container-stupid.model';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleContainerAccessModel } from '../../../model/store/host-area.model';
import { VehicleContainerViewModel } from '../../base/vehicle-container-state.model';

@State<VehicleContainerViewModel>({
  name: StateNamesEnum.formView,
  defaults: { dropDown: Object.values(VehicleEnum), containersCount: 0 }
})
@Injectable()
export class FormViewVehicleContainerState extends FormViewSingleResponsibilityState<
  VehicleContainerViewModel,
  HostVehicleContainerAccessModel
> {
  constructor(
    @Self() protected readonly host: HostAreaAccessService<HostVehicleContainerAccessModel>
  ) {
    super(host);
  }

  @Selector()
  @registerSelectorVehicleContainerMethod('')
  static formView$(state: VehicleContainerViewModel): VehicleContainerStupidViewModel {
    return {
      dropDown: state.dropDown,
      remove: state.containersCount > 0
    };
  }
}
