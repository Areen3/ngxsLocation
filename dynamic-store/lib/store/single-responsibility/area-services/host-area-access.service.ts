import { Injectable } from '@angular/core';
import { HostSingleResponsibilityAreaAccessModel } from '../../../model/store/base-simple-store.model';

@Injectable()
export class HostAreaAccessService<TData extends HostSingleResponsibilityAreaAccessModel> {
  protected _ctx: TData = <TData>(<unknown>{ data: {}, metaData: {}, context: {} });

  get ctx(): TData {
    if (this._ctx === undefined) throw Error(`You should set ctx data`);
    return this._ctx;
  }

  set ctx(ctx: TData) {
    this._ctx = ctx;
  }
}