import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { RangeLocations, Store } from '@ngxs/store';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { DashBoardState } from '../../logic/dash-board/dash-board.state';
import { AbstractVehicleContainerState } from '../../store/base/abstract-vehicle-container.state';
import { RoutingLoadModel } from '../../model/store/routing-load.model';
import { DashBoardContextItemModel } from '../../logic/dash-board/dash-board-state.model';
import { SetIsLoadingRouterAction } from '../../logic/routing/state.actions';
import { LoadVehicleContainerAppServiceAction } from '../../store/base/state.actions';
import { LocationBuildersUtils } from '../../logic/utils/location-builders.utils';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { RoutingSingleResponsibilityState } from '../../store/single-responsibility/base/routing-single-responsibility.state';

@Injectable({ providedIn: 'root' })
export class VehicleContainerGuard implements CanActivate {
  constructor(
    private readonly store: Store,
    private readonly locBuilder: LocationBuildersUtils
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = Number(route.paramMap.get('id'));
    return this.store.selectOnce(DashBoardState.formContext$).pipe(
      map(item => item.items.find(container => container.id === id)),
      map(container => {
        if (!container) throw new Error(`Container with id ${id} doesn't exist`);
        return container!;
      }),
      switchMap(container => {
        const loc = this.locBuilder.convertLocation(
          container.location,
          container.type,
          StateNamesEnum.routing
        );
        const routing = <RoutingLoadModel>(
          this.store.selectSnapshotInContext(
            container.type === VehicleContainerEnum.singleResponsibilityStore
              ? RoutingSingleResponsibilityState.routing$
              : AbstractVehicleContainerState.routing$,
            loc
          )
        );
        if (routing.isLoading && !routing.loaded) return of(false);
        if (routing.loaded) return of(true);
        return this.loadData(container);
      })
    );
  }

  loadData(container: DashBoardContextItemModel): Observable<boolean> {
    const loc = this.locBuilder.convertLocation(
      container.location,
      container.type,
      StateNamesEnum.routing
    );
    return from(this.store.dispatchInLocation(new SetIsLoadingRouterAction(true), loc)).pipe(
      switchMap(() =>
        this.store.dispatchInLocation(
          new LoadVehicleContainerAppServiceAction(container),
          RangeLocations.filterByContext(container.type, container.type)
        )
      ),
      switchMap(() =>
        this.store.selectInContext<RoutingLoadModel>(
          AbstractVehicleContainerState.routing$,
          loc
        )
      ),
      filter(data => data.loaded),
      take(1),
      map(() => true)
    );
  }
}
