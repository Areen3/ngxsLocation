import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { RangeLocations, Store } from '@ngxs/store';
import { map, switchMap } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { VehicleContainerEnum } from '../model/enums/vehicle-container.enum';
import { AddVehicleContainerAppServiceAction } from '../store/base/state.actions';
import { RoutingPathEnum } from '../model/enums/routing-path-enum';
import { DashBoardState } from '../store/dash-board/dash-board.state';

@Injectable({ providedIn: 'root' })
export class VehicleContainerAddGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const containerType = <VehicleContainerEnum>route.paramMap.get('type');
    return from(
      this.store.dispatchInLocation(
        new AddVehicleContainerAppServiceAction({ vehicle: containerType, withStore: true }),
        RangeLocations.filterByContext(containerType, containerType)
      )
    ).pipe(
      switchMap(() => {
        const data = this.store.selectSnapshot(DashBoardState.model$);
        return this.store.dispatch(
          new Navigate([
            RoutingPathEnum.dashboard,
            RoutingPathEnum.vehicleContainer,
            data.lastId
          ])
        );
      }),
      map(() => true)
    );
  }
}
