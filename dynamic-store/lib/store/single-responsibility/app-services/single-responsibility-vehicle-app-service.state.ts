import { Injectable, Type } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { concatAll, concatMap, last, map, switchMap, take } from 'rxjs/operators';
import {
  Action,
  RangeLocations,
  SingleLocation,
  State,
  StateContext,
  Store
} from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/store/state-names.enum';
import { StateBuildersUtils } from '../../../logic/utils/state-builders.utils';
import { VehicleContainerDalService } from '../../../backend/vehicle-container-dal.service';
import {
  AddVehicleAppServiceAction,
  AddVehicleBackendContainerAppServiceAction,
  AddVehicleContainerAppServiceAction,
  ChangeSpeedAppServiceAction,
  LoadVehicleContainerAppServiceAction,
  RemoveVehicleAppServiceAction,
  RemoveVehicleBackendContainerAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from '../../app-service/state.actions';
import {
  DashboardAddItemAction,
  DashboardRemoveItemAction
} from '../../../logic/dash-board/state.actions';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction,
  RemoveVehicleContainerAction
} from '../../../logic/vehicle-container/state.actions';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../../../model/enums/routing-path-enum';
import { VehicleDependencyInjectContainerState } from '../../dependency-incject/vehicle-dependency-inject-container.state';
import { VehicleContainerStateModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import { getRegisterVehicleState } from '../../../model/decorators/register-vehicle-state.decorator';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import {
  DashBoardContextItemModel,
  DashBoardStateModel
} from '../../../logic/dash-board/dash-board-state.model';
import {
  ChangeSpeedVehicleAction,
  UpdateVehicleAction
} from '../../../logic/base/state.actions';
import { SetLoadedRouterAction } from '../../../logic/routing/state.actions';
import { DashBoardState } from '../../../logic/dash-board/dash-board.state';
import { getRegisterContainerState } from '../../../model/decorators/register-container-state.decorator';
import { VehicleEnum } from '../../../model/domain/vehicle.enum';
import { BaseVehicleAppServiceState } from '../../app-service/base-vehicle-app-service.state';

@State<IEmptyObject>({
  name: StateNamesEnum.vehicleAppService
})
@Injectable()
export class SingleResponsibilityVehicleAppServiceState extends BaseVehicleAppServiceState {
  constructor(
    private readonly store: Store,
    protected readonly storeBuilder: StateBuildersUtils,
    private readonly dal: VehicleContainerDalService
  ) {
    super(storeBuilder);
  }

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
      switchMap(() =>
        this.store.dispatchInLocation(
          new RemoveVehicleContainerAction(action.payload.id),
          loc.getChildLocation(StateNamesEnum.crudSrState)
        )
      ),
      switchMap(() => this.store.dispatch(new Navigate([RoutingPathEnum.dashboard])))
    );
  }

  @Action(AddVehicleAppServiceAction)
  addVehicle(
    _ctx: StateContext<IEmptyObject>,
    action: AddVehicleAppServiceAction
  ): Observable<any> {
    const loc: SingleLocation = this.getContainerLocalization(action.payload.container.name);
    return from(
      this.store.selectOnceInContext(VehicleDependencyInjectContainerState.state$, loc)
    ).pipe(
      switchMap((state: VehicleContainerStateModel) => {
        const newLastId = state.data.lastId + 1;
        const childName = this.storeBuilder.buildStateName(StateNamesEnum.vehicle, newLastId);
        const type = getRegisterVehicleState(
          VehicleContainerEnum.dependencyInjectedStore,
          action.payload.vehicle
        );
        return this.innerAddStoreVehicle(
          loc,
          newLastId,
          childName,
          type,
          action.payload.vehicle
        );
      })
    );
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

  @Action(LoadVehicleContainerAppServiceAction)
  LoadVehicleContainerAppServiceAction(
    _ctx: StateContext<IEmptyObject>,
    action: LoadVehicleContainerAppServiceAction
  ): Observable<any> {
    const context = action.payload;
    const loc = SingleLocation.getLocation(context.location);
    return from(this.dal.getEntityByIdWithGenerate(context.id)).pipe(
      switchMap(data =>
        of(...data.vehicles).pipe(
          concatMap(vehicle =>
            this.store.dispatchInLocation(
              new AddVehicleAppServiceAction({ container: context, vehicle }),
              RangeLocations.filterByContext(context.type, context.type)
            )
          )
        )
      ),
      switchMap(() =>
        this.store.dispatchInLocation(
          new SetLoadedRouterAction(true),
          loc.getChildLocation(StateNamesEnum.routing)
        )
      )
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

  private addVehicleContainer(
    containerEnum: VehicleContainerEnum,
    readBe = true
  ): Observable<DashBoardContextItemModel> {
    return this.store.selectOnce(DashBoardState.state$).pipe(
      map((data: DashBoardStateModel) =>
        this.buildDashBoardContextItem(data.data.lastId, containerEnum)
      ),
      switchMap(data =>
        of(
          this.innerAddStoreContainer(data, getRegisterContainerState(containerEnum)),
          this.store.dispatchInLocation(
            new SetLoadedRouterAction(readBe),
            SingleLocation.getLocation(data.location).getChildLocation(StateNamesEnum.routing)
          ),
          of(data)
        )
      ),
      concatAll(),
      last(),
      switchMap((entity: DashBoardContextItemModel) => this.dal.addEntity(entity))
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
          SingleLocation.getLocation(data.location).getChildLocation(
            StateNamesEnum.crudSrState
          )
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
            name: childName,
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
