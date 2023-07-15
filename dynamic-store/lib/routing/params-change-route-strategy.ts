import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouteReuseStrategy } from '@angular/router';
import { IEmptyObject } from '../model/base/base';

@Injectable()
export class ParamChangeRouteResultStrategy extends RouteReuseStrategy {
  shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(_route: ActivatedRouteSnapshot, _handle: IEmptyObject): void {}

  shouldAttach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  retrieve(_route: ActivatedRouteSnapshot): IEmptyObject | null {
    return null;
  }

  shouldReuseRoute(_future: ActivatedRouteSnapshot, _curr: ActivatedRouteSnapshot): boolean {
    // default is true if configuration of current and future route are the same
    return false;
  }
}
