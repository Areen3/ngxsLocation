import {
  DashBoardElementsModel,
  DashBoardSimulateModel,
  DashBoardViewModel
} from '../../store/dash-board/dash-board-state.model';
import { IEmptyObject } from '../base/base';

export interface DashBoardStupidModelModel
  extends IEmptyObject,
    Pick<DashBoardElementsModel, 'items'>,
    DashBoardSimulateModel {
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardStupidViewModel extends DashBoardViewModel {}
