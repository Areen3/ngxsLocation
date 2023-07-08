import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { DataSingleResponsibilityStoreModel } from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormDataSingleResponsibilityState } from '../base/form-data-single-responsibility.state';
import { VehicleContainerDataModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import {
  AddVehicleContainerAction,
  RemoveVehicleContainerAction
} from '../../../logic/vehicle-container/state.actions';

@State<DataSingleResponsibilityStoreModel<VehicleContainerDataModel>>({
  name: StateNamesEnum.formData,
  defaults: {
    data: { lastId: 0, type: VehicleContainerEnum.dynamicStore, itemNumber: 0 }
  }
})
@Injectable()
export class FormDataVehicleContainerState<
  T extends VehicleContainerDataModel
> extends FormDataSingleResponsibilityState<T> {
  @Action(AddVehicleContainerAction)
  AddVehicleContainer(
    ctx: StateContext<DataSingleResponsibilityStoreModel<T>>,
    action: AddVehicleContainerAction
  ) {
    const state = ctx.getState();
    ctx.patchState({ data: { ...state.data, itemNumber: action.payload.id } });
  }

  @Action(RemoveVehicleContainerAction)
  RemoveVehicleContainer(
    ctx: StateContext<DataSingleResponsibilityStoreModel<T>>,
    action: RemoveVehicleContainerAction
  ) {
    const state = ctx.getState();
    console.log(state, action);
  }
}
