import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { from, Observable } from 'rxjs';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { Injectable } from '@angular/core';
import { RangeLocations, Store } from '@ngxs/store';
import { AddVehicleContainerAppServiceAction } from '../../store/app-service/state.actions';
import { map, switchMap } from 'rxjs/operators';
import { DashBoardState } from '../../logic/dash-board/dash-board.state';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../../model/enums/routing-path-enum';

@Injectable({ providedIn: 'root' })
export class VehicleContainerAddGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const containerType = <VehicleContainerEnum>route.paramMap.get('type');
    return from(
      this.store.dispatchInLocation(
        new AddVehicleContainerAppServiceAction(containerType),
        RangeLocations.filterByContext(containerType, containerType)
      )
    ).pipe(
      switchMap(() => {
        const data = this.store.selectSnapshot(DashBoardState.data$);
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
