import {
  DashBoardElementsModel,
  DashBoardModelModel,
  DashBoardViewModel
} from '../../store/dash-board/dash-board-state.model';

export interface DashBoardStupidModelModel
  extends Pick<DashBoardElementsModel, 'items'>,
    Pick<DashBoardModelModel, 'simulate'> {
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardStupidViewModel extends DashBoardViewModel {}
