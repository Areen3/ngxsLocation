import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { SingleLocation } from '@ngxs/store';
import { Injectable } from '@angular/core';

@Injectable()
export class LocationBuildersUtils {
  convertLocation(
    loc: string,
    veh: VehicleContainerEnum,
    singleResp: StateNamesEnum
  ): SingleLocation {
    if (veh === VehicleContainerEnum.singleResponsibilityStore)
      return SingleLocation.getLocation(loc).getChildLocation(singleResp);
    return SingleLocation.getLocation(loc);
  }
}
