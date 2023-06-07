import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SingleLocation, Store } from '@ngxs/store';
import { DashBoardState } from '../dash-board/dash-board.state';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import {
  AddDashboardItemAction,
  RemoveDashboardItemAction
} from '../dash-board/state.actions';
import {
  DashBoardContextItemModel,
  DashBoardStateModel
} from '../dash-board/dash-board-state.model';
import { VehicleContainerState } from '../vehicle-container/vehicle-container.state';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction
} from '../vehicle-container/state.actions';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { UpdateVehicleAction } from '../base/state.actions';
import { getRegisterState } from '../../model/decorators/register-state.decorator';
import { VehicleItemModel } from '../../model/store/vehicle-item.model';
import { VehicleContainerStateModel } from '../vehicle-container/vehicle-container-state.model';

@Injectable()
export class VehicleContainerManagerService {
  constructor(private store: Store, private storeBuilder: StateBuildersUtils) {}

  addContainer(): void {
    this.addVehicleContainer().subscribe(() => {
      console.log('added');
    });
  }

  removeContainer(element: DashBoardContextItemModel): void {
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

  addVehicle(container: DashBoardContextItemModel, vehicle: VehicleEnum): void {
    const loc: SingleLocation = this.getContainerLocalization(container.name);
    const state: VehicleContainerStateModel = this.store.selectSnapshotInContext(
      VehicleContainerState.state$,
      loc
    );
    const newLastId = state.data.lastId + 1;
    const childName = this.storeBuilder.buildStateName(StateNamesEnum.vehicle, newLastId);
    const type = getRegisterState(vehicle);
    this.innerAddStoreVehicle(loc, newLastId, childName, type, vehicle).subscribe(() => {
      console.log('added vehicle');
    });
  }

  removeVehicle(vehicle: VehicleItemModel): void {
    const parentLoc = SingleLocation.getLocation(vehicle.location).getParentPath();
    this.store
      .dispatchInLocation(new RemoveVehicleAction(vehicle.id), parentLoc)
      .pipe(
        switchMap(() =>
          this.store.removeChildInLocalization(SingleLocation.getLocation(vehicle.location))
        ),
        take(1)
      )
      .subscribe(() => {
        console.log('removed vehicle');
      });
  }

  private addVehicleContainer(): Observable<any> {
    return this.store.selectOnce(DashBoardState.state$).pipe(
      switchMap((data: DashBoardStateModel) => {
        const loc: SingleLocation = SingleLocation.getLocation(StateNamesEnum.dashBoard);
        const newLastId = data.data.lastId + 1;
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
