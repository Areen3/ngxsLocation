import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, of } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { Action, SingleLocation, State, StateContext, Store } from '@ngxs/store';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { getRegisterVehicleState } from '../../model/decorators/register-vehicle-state.decorator';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleDependencyInjectContainerState } from '../dependency-incject/vehicle-dependency-inject-container.state';
import { IEmptyObject } from '../../model/base/base';
import {
  AddVehicleAppServiceAction,
  AddVehicleContainerAppServiceAction,
  ChangeSpeedAppServiceAction,
  LoadVehicleContainerAppServiceAction,
  RemoveVehicleAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from '../base/state.actions';
import { getRegisterContainerState } from '../../model/decorators/register-container-state.decorator';
import { VehicleContainerDalService } from '../../backend/vehicle-container-dal.service';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../../model/enums/routing-path-enum';
import { BaseVehicleAppServiceState } from '../base/base-vehicle-app-service.state';
import { SetLoadedRouterAction } from '../routing/routing-state.actions';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import { DashBoardState } from '../dash-board/dash-board.state';
import { DashBoardStateModel } from '../dash-board/dash-board-state.model';
import {
  DashboardAddItemAction,
  DashboardRemoveItemAction
} from '../dash-board/dahs-board-state.actions';
import {
  AddVehicleAction,
  AddVehicleContainerAction,
  RemoveVehicleAction
} from '../base/vehicle-container.state.actions';
import { VehicleContainerStateModel } from '../base/vehicle-container-state.model';
import { ChangeSpeedVehicleAction, UpdateVehicleAction } from '../base/vehicle-state.actions';

@State<IEmptyObject>({
  name: StateNamesEnum.vehicleAppService
})
@Injectable()
export class DynamicVehicleAppServiceState extends BaseVehicleAppServiceState {
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
    const containerEnum = action.payload.vehicle;
    return this.store.selectOnce(DashBoardState.state$).pipe(
      map((data: DashBoardStateModel) => {
        const elements = this.buildDashBoardElementsItem(data.model.lastId, containerEnum);
        const type = getRegisterContainerState(containerEnum);
        const loc = SingleLocation.getLocation(elements.location);
        const parent = loc.getParentPath();
        return { elements, type, loc, parent };
      }),
      switchMap(data =>
        forkJoin([
          of(data),
          this.store.addChildInLocalization(data.type, data.parent, {
            childName: data.elements.name
          })
        ])
      ),
      switchMap(([data]) =>
        forkJoin([
          of(data),
          this.store.dispatchInLocation(
            new DashboardAddItemAction(data.elements),
            data.parent
          ),
          this.store.dispatchInLocation(new AddVehicleContainerAction(data.elements), data.loc)
        ])
      ),
      switchMap(([data]) =>
        forkJoin([
          of(data),
          this.store.dispatchInLocation(
            new SetLoadedRouterAction(action.payload.withStore),
            data.loc
          )
        ])
      ),
      switchMap(([data]) => this.dal.addEntity(data.elements))
    );
  }

  @Action(RemoveVehicleContainerAppServiceAction)
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
    return this.store
      .selectOnceInContext<VehicleContainerStateModel>(
        VehicleDependencyInjectContainerState.state$,
        this.getContainerLocalization(action.payload.container.name)
      )
      .pipe(
        map(state => {
          const newLastId = state.model.lastId + 1;
          const childName = this.storeBuilder.buildStateName(
            StateNamesEnum.vehicle,
            newLastId
          );
          const type = getRegisterVehicleState(
            VehicleContainerEnum.dependencyInjectedStore,
            action.payload.vehicle
          );
          const loc: SingleLocation = this.getContainerLocalization(
            action.payload.container.name
          );
          return { newLastId, childName, type, loc };
        }),
        switchMap(data =>
          forkJoin([
            of(data),
            this.store.addChildInLocalization(data.type, data.loc, {
              childName: data.childName
            })
          ])
        ),
        switchMap(([data]) =>
          forkJoin([
            of(data),
            this.store.dispatchInLocation(
              new AddVehicleAction({
                id: data.newLastId,
                vehicle: action.payload.vehicle,
                name: data.childName,
                location: data.loc.getChildLocation(data.childName).path
              }),
              data.loc
            )
          ])
        ),
        switchMap(([data]) =>
          this.store.dispatchInLocation(
            new UpdateVehicleAction({ name: data.childName, type: action.payload.vehicle }),
            data.loc.getChildLocation(data.childName)
          )
        )
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
        )
      );
  }

  @Action(LoadVehicleContainerAppServiceAction)
  LoadVehicleContainerAppServiceAction(
    ctx: StateContext<IEmptyObject>,
    action: LoadVehicleContainerAppServiceAction
  ): Observable<any> {
    const elements = action.payload;
    const loc = SingleLocation.getLocation(elements.location);
    return from(this.dal.getEntityByIdWithGenerate(elements.id)).pipe(
      switchMap(data =>
        of(...data.vehicles).pipe(
          concatMap(vehicle =>
            this.store.dispatchInLocation(
              new AddVehicleAppServiceAction({ container: elements, vehicle }),
              ctx.getLocation()
            )
          )
        )
      ),
      switchMap(() => this.store.dispatchInLocation(new SetLoadedRouterAction(true), loc))
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
}
