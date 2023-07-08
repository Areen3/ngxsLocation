import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { IEmptyObject } from '../../model/base/base';

@State<IEmptyObject>({
  name: StateNamesEnum.baseSimpleResponsibility,
  defaults: {}
})
@Injectable()
export class BaseSingleResponsibilityState {}
