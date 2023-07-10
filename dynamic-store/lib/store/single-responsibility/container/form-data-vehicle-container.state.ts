import { Injectable, Self } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { DataSingleResponsibilityStoreModel } from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormDataSingleResponsibilityState } from '../base/form-data-single-responsibility.state';
import { VehicleContainerDataModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import { registerSelectorMethod } from '../../../model/decorators/register-selector-method.decorator';
import { VehicleContainerStupidDataModel } from '../../../model/stupid/vehicle-container-stupid.model';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleContainerAccessModel } from '../../../model/store/host-area.model';

@State<DataSingleResponsibilityStoreModel<VehicleContainerDataModel>>({
  name: StateNamesEnum.formData,
  defaults: {
    data: { lastId: 0, type: VehicleContainerEnum.singleResponsibilityStore, itemNumber: 0 }
  }
})
@Injectable()
export class FormDataVehicleContainerState<
  T extends VehicleContainerDataModel
> extends FormDataSingleResponsibilityState<T, HostVehicleContainerAccessModel> {
  constructor(
    @Self() protected readonly host: HostAreaAccessService<HostVehicleContainerAccessModel>
  ) {
    super(host);
  }

  @Selector()
  @registerSelectorMethod('')
  static formData$(
    state: DataSingleResponsibilityStoreModel<VehicleContainerDataModel>
  ): VehicleContainerStupidDataModel {
    return {
      items: [], //state.context.items,
      name: state.data.type.toString(),
      id: state.data.lastId
    };
  }
}
