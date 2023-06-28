import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VehicleContainerGuard implements CanActivate {
  //constructor(private readonly store: Store) {  }

  //canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  canActivate(): Observable<boolean> {
    // const id = Number(route.paramMap.get('id'));
    return of(true);

    // return from(this.store.dispatch(new Navigate([RoutingPathEnum.dashboard, RoutingPathEnum.vehicleContainer, id])))
    //   .pipe(
    //     map(() => true)
    //   );
  }
}
