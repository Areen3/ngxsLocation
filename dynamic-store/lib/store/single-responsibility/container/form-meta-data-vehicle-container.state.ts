import { Injectable, Self } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormMetaDataSingleResponsibilityState } from '../base/form-meta-data-single-responsibility.state';
import { VehicleContainerMetaDataModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import { registerSelectorMethod } from '../../../model/decorators/register-selector-method.decorator';
import { VehicleContainerStupidMetaDataModel } from '../../../model/stupid/vehicle-container-stupid.model';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleContainerAccessModel } from '../../../model/store/host-area.model';

@State<VehicleContainerMetaDataModel>({
  name: StateNamesEnum.formMetaData,
  defaults: { dropDown: Object.values(VehicleEnum), containersCount: 0 }
})
@Injectable()
export class FormMetaDataVehicleContainerState extends FormMetaDataSingleResponsibilityState<
  VehicleContainerMetaDataModel,
  HostVehicleContainerAccessModel
> {
  constructor(
    @Self() protected readonly host: HostAreaAccessService<HostVehicleContainerAccessModel>
  ) {
    super(host);
  }

  @Selector()
  @registerSelectorMethod('')
  static formMetaData$(
    state: VehicleContainerMetaDataModel
  ): VehicleContainerStupidMetaDataModel {
    return {
      dropDown: state.dropDown,
      remove: state.containersCount > 0
    };
  }
}
