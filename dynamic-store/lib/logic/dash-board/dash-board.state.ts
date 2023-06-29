import { Action, Selector, SingleLocation, State, StateContext } from '@ngxs/store';
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
import { StateBuildersUtils } from '../utils/state-builders.utils';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../model/stupid/dash-board-stupid.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleAppServiceState } from '../../store/app-service/vehicle-app-service.state';

@State<DashBoardStateModel>({
  name: StateNamesEnum.dashBoard,
  defaults: {
    data: { lastId: 0, id: 0, simulate: false },
    context: { items: [] },
    metaData: { dropDown: Object.values(VehicleContainerEnum), remove: false }
  },
  children: [VehicleAppServiceState]
})
@Injectable()
export class DashBoardState {
  constructor(private storeBuilder: StateBuildersUtils) {}

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
    const name = this.storeBuilder.buildStateName(
      StateNamesEnum.vehicleContainer,
      action.payload
    );
    const locContainer = SingleLocation.getLocation(StateNamesEnum.dashBoard).getChildLocation(
      name
    );
    ctx.patchState({
      context: {
        ...state.context,
        items: [
          ...state.context.items,
          { name, id: action.payload, location: locContainer.path }
        ]
      },
      data: {
        ...state.data,
        lastId: action.payload
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
    const items = state.context.items.filter(item => item.id !== action.payload);
    ctx.patchState({ context: { ...state.context, items } });
  }
}
