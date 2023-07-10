import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MetaDataSingleResponsibilityStoreModel } from '../../../model/store/base-simple-store.model';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { FormMetaDataSingleResponsibilityState } from '../base/form-meta-data-single-responsibility.state';
import {
  VehicleContainerMetaDataModel,
  VehicleContainerStateModel
} from '../../../logic/vehicle-container/vehicle-container-state.model';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import { UpdateMetaDataAction } from '../base/meta-data-state.actions';
import { registerSelectorMethod } from '../../../model/decorators/register-selector-method.decorator';
import { VehicleContainerStupidMetaDataModel } from '../../../model/stupid/vehicle-container-stupid.model';
import { SetCountContainerAction } from '../../../logic/vehicle-container/state.actions';

@State<MetaDataSingleResponsibilityStoreModel<VehicleContainerMetaDataModel>>({
  name: StateNamesEnum.formMetaData,
  defaults: {
    metaData: { dropDown: Object.values(VehicleEnum), containersCount: 0 }
  }
})
@Injectable()
export class FormMetaDataVehicleContainerState<
  T extends VehicleContainerMetaDataModel
> extends FormMetaDataSingleResponsibilityState<any> {
  @Selector()
  @registerSelectorMethod('')
  static formMetaData$(
    state: MetaDataSingleResponsibilityStoreModel<VehicleContainerMetaDataModel>
  ): VehicleContainerStupidMetaDataModel {
    return {
      dropDown: state.metaData.dropDown,
      remove: state.metaData.containersCount > 0
    };
  }

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
  @Action(SetCountContainerAction)
  SetCountContainer(
    ctx: StateContext<VehicleContainerStateModel>,
    action: SetCountContainerAction
  ) {
    const state: VehicleContainerStateModel = ctx.getState();
    ctx.patchState({
      metaData: {
        ...state.metaData,
        containersCount: state.metaData.containersCount + action.payload
      }
    });
  }
}
