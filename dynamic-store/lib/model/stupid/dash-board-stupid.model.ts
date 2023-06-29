import {
  DashBoardContextModel,
  DashBoardDataModel,
  DashBoardMetaDataModel
} from '../../logic/dash-board/dash-board-state.model';

export interface DashBoardStupidDataModel
  extends Pick<DashBoardContextModel, 'items'>,
    Pick<DashBoardDataModel, 'simulate'> {
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardStupidMetaDataModel extends DashBoardMetaDataModel {}
