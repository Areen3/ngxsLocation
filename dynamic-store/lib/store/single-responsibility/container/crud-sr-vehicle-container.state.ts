import { Injectable, Self } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import {
  AddVehicleContainerAction,
  RemoveVehicleContainerAction
} from '../../../logic/vehicle-container/state.actions';
import { IEmptyObject } from '../../../model/base/base';
import { BaseSingleResponsibilityState } from '../base/base-single-responsibility.state';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostVehicleContainerAccessModel } from '../../../model/store/host-area.model';
import {
  VehicleContainerDataModel,
  VehicleContainerMetaDataModel
} from '../../../logic/vehicle-container/vehicle-container-state.model';
import { UpdateMetaDataAction } from '../base/meta-data-state.actions';
import { from, Observable } from 'rxjs';
import { UpdateDataAction } from '../base/data-state.actions';

@State<IEmptyObject>({
  name: StateNamesEnum.crudSrState,
  defaults: {}
})
@Injectable()
export class CrudSrVehicleContainerState extends BaseSingleResponsibilityState<HostVehicleContainerAccessModel> {
  constructor(
    private readonly store: Store,
    @Self() protected readonly host: HostAreaAccessService<HostVehicleContainerAccessModel>
  ) {
    super(host);
  }

  @Action(AddVehicleContainerAction)
  AddVehicleContainer(
    ctx: StateContext<IEmptyObject>,
    action: AddVehicleContainerAction
  ): Observable<any> {
    const locData = ctx.getLocation().getNeighborLocation(StateNamesEnum.formData);
    const locMeaData = ctx.getLocation().getNeighborLocation(StateNamesEnum.formMetaData);
    const dataState = this.host.ctx.model.getState();
    const newData: VehicleContainerDataModel = {
      ...dataState,
      itemNumber: action.payload.id
    };
    const metaDataState = this.host.ctx.view.getState();
    const newMetaData: VehicleContainerMetaDataModel = {
      ...metaDataState,
      containersCount: metaDataState.containersCount + 1
    };
    return from([
      this.store.dispatchInLocation(
        new UpdateDataAction<VehicleContainerDataModel>(newData),
        locData
      ),
      this.store.dispatchInLocation(
        new UpdateMetaDataAction<VehicleContainerMetaDataModel>(newMetaData),
        locMeaData
      )
    ]);
  }

  @Action(RemoveVehicleContainerAction)
  RemoveVehicleContainer(ctx: StateContext<IEmptyObject>) {
    const locMeaData = ctx.getLocation().getNeighborLocation(StateNamesEnum.formMetaData);
    const metaDataState = this.host.ctx.view.getState();
    const newMetaData: VehicleContainerMetaDataModel = {
      ...metaDataState,
      containersCount: metaDataState.containersCount - 1
    };
    return this.store.dispatchInLocation(
      new UpdateMetaDataAction<VehicleContainerMetaDataModel>(newMetaData),
      locMeaData
    );
  }
}
