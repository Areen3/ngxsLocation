import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SingleLocation, Store } from '@ngxs/store';
import { DashBoardState } from '../dash-board/dash-board.state';
import { VehicleContainerState } from '../container/vehicle-container.state';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import { AddVehicleContainerAction } from '../container/state.actions';
import {
  AddDashboardItemAction,
  RemoveDashboardItemAction
} from '../dash-board/state.actions';
import { DashBoardItemModel } from '../dash-board/dash-board-state.model';

@Injectable()
export class VehicleContainerManagerService {
  constructor(private store: Store, private storeBuilder: StateBuildersUtils) {}

  addContainer(): void {
    this.addVehicleContainer()
      .pipe(take(1))
      .subscribe(() => {
        console.log('added');
      });
  }

  removeContainer(element: DashBoardItemModel): void {
    const loc: SingleLocation = SingleLocation.getLocation(
      StateNamesEnum.dashBoard,
      element.name
    );
    this.store
      .removeChildInLocalization(loc)
      .pipe(switchMap(() => this.store.dispatch(new RemoveDashboardItemAction(element.id))))
      .subscribe(() => {
        console.log('removed');
      });
  }

  private addVehicleContainer(): Observable<any> {
    return this.store.selectOnce(DashBoardState.lastId$).pipe(
      switchMap((lastId: number) => {
        const loc: SingleLocation = SingleLocation.getLocation(StateNamesEnum.dashBoard);
        const newLastId = lastId + 1;
        const childName = this.storeBuilder.buildStateName(
          StateNamesEnum.vehicleContainer,
          newLastId
        );
        return this.innerAddStore(loc, newLastId, childName);
      })
    );
  }

  private innerAddStore(
    loc: SingleLocation,
    count: number,
    childName: string
  ): Observable<any> {
    return this.store.addChildInLocalization(VehicleContainerState, loc, { childName }).pipe(
      switchMap(() => this.store.dispatchInLocation(new AddDashboardItemAction(count), loc)),
      switchMap(() =>
        this.store.dispatchInLocation(
          new AddVehicleContainerAction(count),
          loc.getChildLocation(childName)
        )
      )
    );
  }
}
