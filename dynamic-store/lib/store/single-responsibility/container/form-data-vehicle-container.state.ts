import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { DataSingleResponsibilityStoreModel } from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormDataSingleResponsibilityState } from '../base/form-data-single-responsibility.state';
import { VehicleContainerDataModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import {
  AddVehicleContainerAction,
  RemoveVehicleContainerAction
} from '../../../logic/vehicle-container/state.actions';
import { registerSelectorMethod } from '../../../model/decorators/register-selector-method.decorator';
import { VehicleContainerStupidDataModel } from '../../../model/stupid/vehicle-container-stupid.model';

@State<DataSingleResponsibilityStoreModel<VehicleContainerDataModel>>({
  name: StateNamesEnum.formData,
  defaults: {
    data: { lastId: 0, type: VehicleContainerEnum.singleResponsibilityStore, itemNumber: 0 }
  }
})
@Injectable()
export class FormDataVehicleContainerState<
  T extends VehicleContainerDataModel
> extends FormDataSingleResponsibilityState<T> {
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
