import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SingleLocation, Store } from '@ngxs/store';
import { DashBoardState } from '../dash-board/dash-board.state';
import { VehicleContainerState } from '../container/vehicle-container.state';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import { AddVehicleContainerAction } from '../container/state.actions';
import { AddDashboardItemAction } from '../dash-board/state.actions';

@Injectable()
export class VehicleContainerManagerService {
  constructor(private store: Store, private storeBuilder: StateBuildersUtils) {}

  addContainer(): void {
    this.addVehicleContainer()
      .pipe(take(1))
      .subscribe(() => {
        console.log('kliknięte');
      });
  }

  removeContainer(element: number): void {
    of(element)
      .pipe(take(1))
      .subscribe(() => {
        console.log('usunięte');
      });
  }

  private addVehicleContainer(): Observable<any> {
    return this.store.selectOnce(DashBoardState.count$).pipe(
      switchMap((count: number) => {
        const loc: SingleLocation = SingleLocation.getLocation(StateNamesEnum.dashBoard);
        const newCount = count + 1;
        const childName = this.storeBuilder.buildStateName(
          StateNamesEnum.vehicleContainer,
          newCount
        );
        return this.store
          .addChildInLocalization(VehicleContainerState, loc, { childName })
          .pipe(
            switchMap(() =>
              this.store.dispatchInLocation(new AddDashboardItemAction(newCount), loc)
            ),
            switchMap(() =>
              this.store.dispatchInLocation(
                new AddVehicleContainerAction(newCount),
                loc.getChildLocation(childName)
              )
            )
          );
      })
    );
  }
}
