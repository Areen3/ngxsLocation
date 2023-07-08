import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';

@State<IEmptyObject>({
  name: StateNamesEnum.baseSimpleResponsibility,
  defaults: {}
})
@Injectable()
export class BaseSingleResponsibilityState {}
