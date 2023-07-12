import {
  Action,
  NgxsOnInit,
  Selector,
  SingleLocation,
  State,
  StateContext,
  Store
} from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  DashBoardContextModel,
  DashBoardDataModel,
  DashBoardStateModel
} from './dash-board-state.model';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import {
  DashboardAddItemAction,
  DashboardRemoveItemAction,
  DashboardSimulateUsersAction
} from './state.actions';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../model/stupid/dash-board-stupid.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { DependencyInjectedVehicleAppServiceState } from '../../store/dependency-incject/dependency-injected-vehicle-app-service.state';
import { SingleResponsibilityVehicleAppServiceState } from '../../store/single-responsibility/app-services/single-responsibility-vehicle-app-service.state';
import { DynamicVehicleAppServiceState } from '../../store/dynamic/dynamic-vehicle-app-service.state';

@State<DashBoardStateModel>({
  name: StateNamesEnum.dashBoard,
  defaults: {
    data: { lastId: 0, id: 0, simulate: false },
    context: { items: [] },
    metaData: { dropDown: Object.values(VehicleContainerEnum), remove: false }
  }
})
@Injectable()
export class DashBoardState implements NgxsOnInit {
  constructor(private readonly store: Store) {}

  @Selector()
  static formData$(state: DashBoardStateModel): DashBoardStupidDataModel {
    return {
      items: state.context.items,
      count: state.context.items.length,
      simulate: state.data.simulate
    };
  }

  @Selector()
  static formMetaData$(state: DashBoardStateModel): DashBoardStupidMetaDataModel {
    return {
      remove: state.context.items.length > 0,
      dropDown: state.metaData.dropDown
    };
  }

  @Selector()
  static formContext$(state: DashBoardStateModel): DashBoardContextModel {
    return state.context;
  }

  @Selector()
  static state$(state: DashBoardStateModel): DashBoardStateModel {
    return state;
  }

  @Selector()
  static data$(state: DashBoardStateModel): DashBoardDataModel {
    return state.data;
  }

  @Selector()
  static simulate$(state: DashBoardStateModel): boolean {
    return state.data.simulate;
  }

  @Action(DashboardAddItemAction)
  AddDashboardItemAction(
    ctx: StateContext<DashBoardStateModel>,
    action: DashboardAddItemAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      context: {
        ...state.context,
        items: [
          ...state.context.items,
          {
            type: action.payload.type,
            name: action.payload.name,
            id: action.payload.id,
            location: action.payload.location
          }
        ]
      },
      data: {
        ...state.data,
        lastId: action.payload.id
      }
    });
  }

  @Action(DashboardSimulateUsersAction)
  DashboardSimulateUsersAction(
    ctx: StateContext<DashBoardStateModel>,
    action: DashboardSimulateUsersAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      data: {
        ...state.data,
        simulate: action.payload
      }
    });
  }

  @Action(DashboardRemoveItemAction)
  RemoveDashboardItemAction(
    ctx: StateContext<DashBoardStateModel>,
    action: DashboardRemoveItemAction
  ) {
    const state = ctx.getState();
    const items = state.context.items.filter(item => item.id !== action.payload.id);
    ctx.patchState({ context: { ...state.context, items } });
  }

  ngxsOnInit(): void {
    const loc = SingleLocation.getLocation(StateNamesEnum.dashBoard);
    forkJoin([
      this.store.addChildInLocalization(DynamicVehicleAppServiceState, loc, {
        childName: VehicleContainerEnum.dynamicStore,
        context: VehicleContainerEnum.dynamicStore
      }),
      this.store.addChildInLocalization(DependencyInjectedVehicleAppServiceState, loc, {
        childName: VehicleContainerEnum.dependencyInjectedStore,
        context: VehicleContainerEnum.dependencyInjectedStore
      }),
      this.store.addChildInLocalization(SingleResponsibilityVehicleAppServiceState, loc, {
        childName: VehicleContainerEnum.singleResponsibilityStore,
        context: VehicleContainerEnum.singleResponsibilityStore
      })
    ])
      .pipe(take(1))
      .subscribe(() => {});
  }
}
