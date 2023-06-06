import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SingleLocation, Store } from '@ngxs/store';
import { DashBoardState } from '../dash-board/dash-board.state';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import {
  AddDashboardItemAction,
  RemoveDashboardItemAction
} from '../dash-board/state.actions';
import { DashBoardItemModel } from '../dash-board/dash-board-state.model';
import { VehicleContainerState } from '../vehicle-container/vehicle-container.state';
import {
  AddVehicleAction,
  AddVehicleContainerAction
} from '../vehicle-container/state.actions';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { UpdateVehicleAction } from '../base/state.actions';
import { getRegisterState } from '../../model/decorators/register-state.decorator';

@Injectable()
export class VehicleContainerManagerService {
  constructor(private store: Store, private storeBuilder: StateBuildersUtils) {}

  addContainer(): void {
    this.addVehicleContainer().subscribe(() => {
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

  addVehicle(container: DashBoardItemModel, vehicle: VehicleEnum): void {
    const loc: SingleLocation = this.getContainerLocalization(container.name);
    const newLastId =
      this.store.selectSnapshotInContext(VehicleContainerState.lastId$, loc) + 1;
    const childName = this.storeBuilder.buildStateName(StateNamesEnum.vehicle, newLastId);
    const type = getRegisterState(vehicle);
    this.innerAddStoreVehicle(loc, newLastId, childName, type, vehicle).subscribe(() => {
      console.log('added vehicle');
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
        return this.innerAddStoreContainer(loc, newLastId, childName, VehicleContainerState);
      })
    );
  }

  private innerAddStoreContainer(
    loc: SingleLocation,
    count: number,
    childName: string,
    type: Type<any>
  ): Observable<any> {
    return this.store.addChildInLocalization(type, loc, { childName }).pipe(
      switchMap(() => this.store.dispatchInLocation(new AddDashboardItemAction(count), loc)),
      switchMap(() =>
        this.store.dispatchInLocation(
          new AddVehicleContainerAction(count),
          loc.getChildLocation(childName)
        )
      )
    );
  }

  private innerAddStoreVehicle(
    loc: SingleLocation,
    count: number,
    childName: string,
    type: Type<any>,
    vehicle: VehicleEnum
  ): Observable<any> {
    return this.store.addChildInLocalization(type, loc, { childName }).pipe(
      switchMap(() =>
        this.store.dispatchInLocation(
          new AddVehicleAction({
            id: count,
            vehicle,
            location: loc.getChildLocation(childName).path
          }),
          loc
        )
      ),
      switchMap(() =>
        this.store.dispatchInLocation(
          new UpdateVehicleAction({ name: childName, type: vehicle }),
          loc.getChildLocation(childName)
        )
      )
    );
  }

  private getContainerLocalization(name: string): SingleLocation {
    return SingleLocation.getLocation(StateNamesEnum.dashBoard).getChildLocation(name);
  }
}
