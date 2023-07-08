import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MetaDataSingleResponsibilityStoreModel } from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormMetaDataSingleResponsibilityState } from '../base/form-meta-data-single-responsibility.state';
import { VehicleContainerMetaDataModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import { UpdateMetaDataAction } from '../base/meta-data-state.actions';

@State<MetaDataSingleResponsibilityStoreModel<VehicleContainerMetaDataModel>>({
  name: StateNamesEnum.formMetaData,
  defaults: {
    metaData: { dropDown: Object.values(VehicleEnum), remove: false }
  }
})
@Injectable()
export class FormMetaDataVehicleContainerState<
  T extends VehicleContainerMetaDataModel
> extends FormMetaDataSingleResponsibilityState<any> {
  @Action(UpdateMetaDataAction)
  UpdateDataAction(
    ctx: StateContext<MetaDataSingleResponsibilityStoreModel<T>>,
    action: UpdateMetaDataAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      metaData: {
        ...state.metaData,
        ...action.payload
      }
    });
  }
}
