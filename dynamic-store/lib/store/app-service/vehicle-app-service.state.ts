import { Injectable, Type } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Action, SingleLocation, State, StateContext, Store } from '@ngxs/store';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { getRegisterVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import {
  DashBoardContextItemModel,
  DashBoardStateModel
} from '../../logic/dash-board/dash-board-state.model';
import {
  DashboardAddItemAction,
  DashboardRemoveItemAction
} from '../../logic/dash-board/state.actions';
import { VehicleContainerStateModel } from '../../logic/vehicle-container/vehicle-container-state.model';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction
} from '../../logic/vehicle-container/state.actions';
import { DashBoardState } from '../../logic/dash-board/dash-board.state';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from '../../logic/base/state.actions';
import { VehicleDependencyInjectContainerState } from '../dependency-incject/vehicle-dependency-inject-container.state';
import { IEmptyObject } from '../../model/base/base';
import {
  AddVehicleAppServiceAction,
  AddVehicleBackendContainerAppServiceAction,
  AddVehicleContainerAppServiceAction,
  ChangeSpeedAppServiceAction,
  RemoveVehicleAppServiceAction,
  RemoveVehicleBackendContainerAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from './state.actions';
import { getRegisterContainerState } from '../../model/decorators/register-container-state.decorator';
import { VehicleContainerDalService } from '../../backend/vehicle-container-dal.service';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../../model/enums/routing-path-enum';

@State<IEmptyObject>({
  name: 'AppServiceVehicle'
})
@Injectable()
export class VehicleAppServiceState {
  constructor(
    private readonly store: Store,
    private readonly storeBuilder: StateBuildersUtils,
    private readonly dal: VehicleContainerDalService
  ) {}

  @Action(AddVehicleContainerAppServiceAction)
  addContainer(
    _ctx: StateContext<IEmptyObject>,
    action: AddVehicleContainerAppServiceAction
  ): Observable<any> {
    return this.addVehicleContainer(action.payload);
  }

  @Action(AddVehicleBackendContainerAppServiceAction)
  addBackendContainer(
    _ctx: StateContext<IEmptyObject>,
    action: AddVehicleBackendContainerAppServiceAction
  ): Observable<any> {
    return this.addVehicleContainer(action.payload, false);
  }

  @Action(RemoveVehicleContainerAppServiceAction)
  @Action(RemoveVehicleBackendContainerAppServiceAction)
  removeContainer(
    _ctx: StateContext<IEmptyObject>,
    action: RemoveVehicleContainerAppServiceAction
  ): Observable<any> {
    const loc: SingleLocation = SingleLocation.getLocation(
      StateNamesEnum.dashBoard,
      action.payload.name
    );
    return this.store.removeChildInLocalization(loc).pipe(
      switchMap(() => this.store.dispatch(new DashboardRemoveItemAction(action.payload))),
      switchMap(() => this.dal.removeEntity(action.payload)),
      switchMap(() => this.store.dispatch(new Navigate([RoutingPathEnum.dashboard])))
    );
  }

  @Action(AddVehicleAppServiceAction)
  addVehicle(
    _ctx: StateContext<IEmptyObject>,
    action: AddVehicleAppServiceAction
  ): Observable<any> {
    const loc: SingleLocation = this.getContainerLocalization(action.payload.container.name);
    const state: VehicleContainerStateModel = this.store.selectSnapshotInContext(
      VehicleDependencyInjectContainerState.state$,
      loc
    );
    const newLastId = state.data.lastId + 1;
    const childName = this.storeBuilder.buildStateName(StateNamesEnum.vehicle, newLastId);
    const type = getRegisterVehicleState(
      VehicleContainerEnum.dependencyInjectedStore,
      action.payload.vehicle
    );
    return this.innerAddStoreVehicle(loc, newLastId, childName, type, action.payload.vehicle);
  }

  @Action(RemoveVehicleAppServiceAction)
  removeVehicle(
    _ctx: StateContext<IEmptyObject>,
    action: RemoveVehicleAppServiceAction
  ): Observable<any> {
    const parentLoc = SingleLocation.getLocation(action.payload.location).getParentPath();
    return this.store
      .dispatchInLocation(new RemoveVehicleAction(action.payload.id), parentLoc)
      .pipe(
        switchMap(() =>
          this.store.removeChildInLocalization(
            SingleLocation.getLocation(action.payload.location)
          )
        ),
        take(1)
      );
  }

  private addVehicleContainer(
    containerEnum: VehicleContainerEnum,
    withState = true
  ): Observable<DashBoardContextItemModel> {
    return this.store.selectOnce(DashBoardState.state$).pipe(
      map((data: DashBoardStateModel) => this.buildDashBoardContextItem(data.data.lastId)),
      switchMap(data => {
        if (!withState) return forkJoin(of(data));
        const type = getRegisterContainerState(containerEnum);
        return forkJoin([of(data), this.innerAddStoreContainer(data, type)]);
      }),
      switchMap(([data]) => this.dal.addEntity(data))
    );
  }

  @Action(ChangeSpeedAppServiceAction)
  changeSpeed(
    _ctx: StateContext<IEmptyObject>,
    action: ChangeSpeedAppServiceAction
  ): Observable<any> {
    const newSpeed = Math.floor(Math.random() * 100);
    return this.store.dispatchInLocation(
      new ChangeSpeedVehicleAction(newSpeed),
      SingleLocation.getLocation(action.payload.location)
    );
  }

  private innerAddStoreContainer(
    data: DashBoardContextItemModel,
    type: Type<any>
  ): Observable<any> {
    const parent = SingleLocation.getLocation(data.location).getParentPath();
    return this.store.addChildInLocalization(type, parent, { childName: data.name }).pipe(
      switchMap(() =>
        this.store.dispatchInLocation(
          new DashboardAddItemAction(data),
          SingleLocation.getLocation(parent.path)
        )
      ),
      switchMap(() =>
        this.store.dispatchInLocation(
          new AddVehicleContainerAction(data),
          SingleLocation.getLocation(data.location)
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

  private buildDashBoardContextItem(lastId: number): DashBoardContextItemModel {
    const loc: SingleLocation = SingleLocation.getLocation(StateNamesEnum.dashBoard);
    const newLastId = lastId + 1;
    const childName = this.storeBuilder.buildStateName(
      StateNamesEnum.vehicleContainer,
      newLastId
    );
    return {
      name: childName,
      id: newLastId,
      location: loc.getChildLocation(childName).path
    };
  }
}
