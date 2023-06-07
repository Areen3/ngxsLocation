import { Action, Selector, SingleLocation, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { DashBoardContextModel, DashBoardStateModel } from './dash-board-state.model';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { AddDashboardItemAction, RemoveDashboardItemAction } from './state.actions';
import { StateBuildersUtils } from '../utils/state-builders.utils';
import {
  DashBoardStupidDataModel,
  DashBoardStupidMetaDataModel
} from '../../model/stupid/dash-board-stupid.model';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';

@State<DashBoardStateModel>({
  name: StateNamesEnum.dashBoard,
  defaults: {
    data: { lastId: 0, id: 0 },
    context: { items: [] },
    metaData: { dropDown: Object.values(VehicleContainerEnum), remove: false }
  }
})
@Injectable()
export class DashBoardState {
  constructor(private storeBuilder: StateBuildersUtils) {}

  @Selector()
  static formData$(state: DashBoardStateModel): DashBoardStupidDataModel {
    return {
      items: state.context.items,
      count: state.context.items.length
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

  @Action(AddDashboardItemAction)
  AddDashboardItemAction(
    ctx: StateContext<DashBoardStateModel>,
    action: AddDashboardItemAction
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

  @Action(RemoveDashboardItemAction)
  RemoveDashboardItemAction(
    ctx: StateContext<DashBoardStateModel>,
    action: RemoveDashboardItemAction
  ) {
    const state = ctx.getState();
    const items = state.context.items.filter(item => item.id !== action.payload);
    ctx.patchState({ context: { ...state.context, items } });
  }
}
