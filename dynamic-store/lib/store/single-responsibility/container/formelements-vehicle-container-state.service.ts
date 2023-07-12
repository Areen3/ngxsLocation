import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { ElementsDataModel } from '../../../model/domain/elementDataModel';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormElementsSingleResponsibilityState } from '../base/form-elements-single-responsibility-state.service';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { HostVehicleContainerAccessModel } from '../../../model/store/host-area.model';

@State<ElementsDataModel<VehicleItemModel>>({
  name: StateNamesEnum.formElements,
  defaults: { items: [] }
})
@Injectable()
export class FormElementsVehicleContainerState<
  T extends ElementsDataModel<VehicleItemModel>
> extends FormElementsSingleResponsibilityState<T, HostVehicleContainerAccessModel> {}
