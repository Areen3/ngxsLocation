import { Injectable, Self } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormModelSingleResponsibilityState } from '../base/form-model-single-responsibility-state.service';
import { VehicleContainerModelModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import { registerSelectorVehicleContainerMethod } from '../../../model/decorators/register-selector-vehicle-container-method.decorator';
import { VehicleContainerStupidModelModel } from '../../../model/stupid/vehicle-container-stupid.model';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleContainerAccessModel } from '../../../model/store/host-area.model';

@State<VehicleContainerModelModel>({
  name: StateNamesEnum.formModel,
  defaults: { lastId: 0, type: VehicleContainerEnum.singleResponsibilityStore, itemNumber: 0 }
})
@Injectable()
export class FormModelVehicleContainerState<
  T extends VehicleContainerModelModel
> extends FormModelSingleResponsibilityState<T, HostVehicleContainerAccessModel> {
  constructor(
    @Self() protected readonly host: HostAreaAccessService<HostVehicleContainerAccessModel>
  ) {
    super(host);
  }

  @Selector()
  @registerSelectorVehicleContainerMethod('')
  static formModel$(state: VehicleContainerModelModel): VehicleContainerStupidModelModel {
    return {
      items: [],
      name: state.type.toString(),
      id: state.lastId
    };
  }
}
