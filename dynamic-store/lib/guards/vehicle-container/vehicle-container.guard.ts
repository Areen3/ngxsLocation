import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { SingleLocation, Store } from '@ngxs/store';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { DashBoardState } from '../../logic/dash-board/dash-board.state';
import { AbstractVehicleContainerState } from '../../store/app-service/abstract-vehicle-container.state';
import { RoutingLoadModel } from '../../model/store/routing-load.model';
import { DashBoardContextItemModel } from '../../logic/dash-board/dash-board-state.model';
import { SetIsLoadingRouterAction } from '../../logic/routing/state.actions';
import { LoadVehicleContainerAppServiceAction } from '../../store/app-service/state.actions';

@Injectable({ providedIn: 'root' })
export class VehicleContainerGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = Number(route.paramMap.get('id'));
    return this.store.selectOnce(DashBoardState.formContext$).pipe(
      map(item => item.items.find(container => container.id === id)),
      map(container => {
        if (!container) throw new Error(`Container with id ${id} doesn't exist`);
        return container!;
      }),
      switchMap(container => {
        const loc = SingleLocation.getLocation(container.location);
        const routing = <RoutingLoadModel>(
          this.store.selectSnapshotInContext(AbstractVehicleContainerState.routing$, loc)
        );
        if (routing.isLoading && !routing.loaded) return of(false);
        if (routing.loaded) return of(true);
        return this.loadData(container);
      })
    );
  }

  loadData(container: DashBoardContextItemModel): Observable<boolean> {
    const loc = SingleLocation.getLocation(container.location);
    return from(this.store.dispatchInLocation(new SetIsLoadingRouterAction(true), loc)).pipe(
      switchMap(() =>
        this.store.dispatch(new LoadVehicleContainerAppServiceAction(container))
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
