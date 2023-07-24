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
  DashBoardElementsModel,
  DashBoardModelModel,
  DashBoardStateModel
} from './dash-board-state.model';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import {
  DashboardAddItemAction,
  DashboardRemoveItemAction,
  DashboardSimulateUsersAction
} from './dahs-board-state.actions';
import {
  DashBoardStupidModelModel,
  DashBoardStupidViewModel
} from '../../model/stupid/dash-board-stupid-model.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { DependencyInjectedVehicleAppServiceState } from '../dependency-incject/dependency-injected-vehicle-app-service.state';
import { SingleResponsibilityVehicleAppServiceState } from '../single-responsibility/app-services/single-responsibility-vehicle-app-service.state';
import { DynamicVehicleAppServiceState } from '../dynamic/dynamic-vehicle-app-service.state';
import { CarDependencyInjectState } from '../dependency-incject/car-dependency-inject.state';

@State<DashBoardStateModel>({
  name: StateNamesEnum.dashBoard,
  defaults: {
    model: { lastId: 0, id: 0, simulate: false },
    elements: { items: [] },
    view: { dropDown: Object.values(VehicleContainerEnum), remove: false }
  },
  children: [CarDependencyInjectState]
})
@Injectable()
export class DashBoardState implements NgxsOnInit {
  constructor(private readonly store: Store) {}

  @Selector()
  static formModel$(state: DashBoardStateModel): DashBoardStupidModelModel {
    return {
      items: state.elements.items,
      count: state.elements.items.length,
      simulate: state.model.simulate
    };
  }

  @Selector()
  static formView$(state: DashBoardStateModel): DashBoardStupidViewModel {
    return {
      remove: state.elements.items.length > 0,
      dropDown: state.view.dropDown
    };
  }

  @Selector()
  static formElements$(state: DashBoardStateModel): DashBoardElementsModel {
    return state.elements;
  }

  @Selector()
  static state$(state: DashBoardStateModel): DashBoardStateModel {
    return state;
  }

  @Selector()
  static model$(state: DashBoardStateModel): DashBoardModelModel {
    return state.model;
  }

  @Selector()
  static simulate$(state: DashBoardStateModel): boolean {
    return state.model.simulate;
  }

  @Action(DashboardAddItemAction)
  AddDashboardItemAction(
    ctx: StateContext<DashBoardStateModel>,
    action: DashboardAddItemAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      elements: {
        ...state.elements,
        items: [
          ...state.elements.items,
          {
            type: action.payload.type,
            name: action.payload.name,
            id: action.payload.id,
            location: action.payload.location
          }
        ]
      },
      model: {
        ...state.model,
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
      model: {
        ...state.model,
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
    const items = state.elements.items.filter(item => item.id !== action.payload.id);
    ctx.patchState({ elements: { ...state.elements, items } });
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
