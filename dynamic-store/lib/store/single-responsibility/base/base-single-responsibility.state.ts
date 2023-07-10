import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { HostAreaAccessService } from '../area-services/host-area-access.service';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';

@State<IEmptyObject>({
  name: StateNamesEnum.baseSimpleResponsibility,
  defaults: {}
})
@Injectable()
export class BaseSingleResponsibilityState<T extends HostSingleResponsibilityAreaAccessModel> {
  constructor(protected readonly host: HostAreaAccessService<T>) {}
}
