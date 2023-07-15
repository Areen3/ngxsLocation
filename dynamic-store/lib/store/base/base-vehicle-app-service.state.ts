import { Injectable } from '@angular/core';
import { SingleLocation, State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { IEmptyObject } from '../../model/base/base';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import { DashBoardElementsItemModel } from '../dash-board/dash-board-state.model';

@State<IEmptyObject>({
  name: StateNamesEnum.vehicleAppService
})
@Injectable()
export class BaseVehicleAppServiceState {
  constructor(protected readonly storeBuilder: StateBuildersUtils) {}

  protected buildDashBoardElementsItem(
    lastId: number,
    type: VehicleContainerEnum
  ): DashBoardElementsItemModel {
    const loc: SingleLocation = SingleLocation.getLocation(StateNamesEnum.dashBoard);
    const newLastId = lastId + 1;
    const childName = this.storeBuilder.buildStateName(
      StateNamesEnum.vehicleContainer,
      newLastId
    );
    return {
      name: childName,
      type: type,
      id: newLastId,
      location: loc.getChildLocation(childName).path
    };
  }
  protected getContainerLocalization(name: string): SingleLocation {
    return SingleLocation.getLocation(StateNamesEnum.dashBoard).getChildLocation(name);
  }
}
