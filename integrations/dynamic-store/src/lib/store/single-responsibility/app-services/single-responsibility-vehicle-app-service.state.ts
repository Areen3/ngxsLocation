import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, of } from 'rxjs';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { Action, SingleLocation, State, StateContext, Store } from '@ngxs/store';
import { IEmptyObject } from '../../../model/base/base';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { VehicleContainerDalService } from '../../../backend/vehicle-container-dal.service';
import {
  AddVehicleAppServiceAction,
  AddVehicleContainerAppServiceAction,
  ChangeSpeedAppServiceAction,
  LoadVehicleContainerAppServiceAction,
  RemoveVehicleAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from '../../base/state.actions';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../../../model/enums/routing-path-enum';
import { getRegisterVehicleState } from '../../../model/decorators/register-vehicle-state.decorator';
import { VehicleContainerEnum } from '../../../model/enums/vehicle-container.enum';
import { getRegisterContainerState } from '../../../model/decorators/register-container-state.decorator';
import { BaseVehicleAppServiceState } from '../../base/base-vehicle-app-service.state';
import { FormModelVehicleContainerState } from '../container/form-model-vehicle-container-state.service';
import { VehicleContainerStupidModelModel } from '../../../model/stupid/vehicle-container-stupid.model';
import { UpdateModelAction } from '../base/data-state.actions';
import { VehicleModel } from '../../../model/domain/vehicle.model';
import { AddToElementsAction, RemoveFromElementsAction } from '../base/elements-state.actions';
import { DashBoardState } from '../../dash-board/dash-board.state';
import { DashBoardStateModel } from '../../dash-board/dash-board-state.model';
import { SetLoadedRouterAction } from '../../routing/routing-state.actions';
import { VehicleContainerModelModel } from '../../base/vehicle-container-state.model';
import { ChangeSpeedVehicleAction } from '../../base/vehicle-state.actions';
import { StateBuildersUtils } from '../../utils/state-builders.utils';
import {
  DashboardAddItemAction,
  DashboardRemoveItemAction
} from '../../dash-board/dahs-board-state.actions';
import { AddVehicleContainerAction } from '../../base/vehicle-container.state.actions';

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
          this.store.dispatchInLocation(
            new AddVehicleContainerAction(data.elements),
            data.loc.getChildLocation(StateNamesEnum.crudSrState)
          )
        ])
      ),
      switchMap(([data]) =>
        forkJoin([
          of(data),
          this.store.dispatchInLocation(
            new SetLoadedRouterAction(action.payload.withStore),
            data.loc.getChildLocation(StateNamesEnum.routing)
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
      .selectOnceInContext<VehicleContainerStupidModelModel>(
        FormModelVehicleContainerState.formModel$,
        this.getContainerLocalization(action.payload.container.name).getChildLocation(
          StateNamesEnum.formModel
        )
      )
      .pipe(
        map(state => {
          const newLastId = state.id + 1;
          const childName = this.storeBuilder.buildStateName(
            StateNamesEnum.vehicle,
            newLastId
          );
          const type = getRegisterVehicleState(
            VehicleContainerEnum.singleResponsibilityStore,
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
              new AddToElementsAction({
                name: data.childName,
                id: data.newLastId,
                location: data.loc.getChildLocation(data.childName).path
              }),
              data.loc.getChildLocation(StateNamesEnum.formElements)
            ),
            this.store.dispatchInLocation(
              new UpdateModelAction<Partial<VehicleContainerModelModel>>({
                lastId: data.newLastId
              }),
              data.loc.getChildLocation(StateNamesEnum.formModel)
            )
          ])
        ),
        switchMap(([data]) =>
          this.store.dispatchInLocation(
            new UpdateModelAction<Partial<VehicleModel>>({
              name: data.childName,
              type: action.payload.vehicle
            }),
            data.loc
              .getChildLocation(data.childName)
              .getChildLocation(StateNamesEnum.formModel)
          )
        )
      );
  }

  @Action(RemoveVehicleAppServiceAction)
  removeVehicle(
    _ctx: StateContext<IEmptyObject>,
    action: RemoveVehicleAppServiceAction
  ): Observable<any> {
    const parentLoc = SingleLocation.getLocation(action.payload.location).getNeighborLocation(
      StateNamesEnum.formElements
    );
    return this.store
      .dispatchInLocation(new RemoveFromElementsAction(action.payload), parentLoc)
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
      SingleLocation.getLocation(action.payload.location).getChildLocation(
        StateNamesEnum.speedSrState
      )
    );
  }
}
