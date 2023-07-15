import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';

import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { StateBuildersUtils } from '../../utils/state-builders.utils';

@State<IEmptyObject>({
  name: StateBuildersUtils.buildSingleResponsibilityStateName(StateNamesEnum.vehicle),
  defaults: {}
})
@Injectable()
export class VehicleSingleResponsibilityState {}
