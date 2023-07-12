import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { ElementsDataModel } from '../../../model/domain/elementDataModel';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormContextSingleResponsibilityState } from '../base/form-context-single-responsibility.state';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { HostVehicleContainerAccessModel } from '../../../model/store/host-area.model';

@State<ElementsDataModel<VehicleItemModel>>({
  name: StateNamesEnum.formContext,
  defaults: { items: [] }
})
@Injectable()
export class FormContextVehicleContainerState<
  T extends ElementsDataModel<VehicleItemModel>
> extends FormContextSingleResponsibilityState<T, HostVehicleContainerAccessModel> {}