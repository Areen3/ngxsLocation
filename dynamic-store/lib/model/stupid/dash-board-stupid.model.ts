import {
  DashBoardContextModel,
  DashBoardMetaDataModel
} from '../../logic/dash-board/dash-board-state.model';

export interface DashBoardStupidDataModel extends Pick<DashBoardContextModel, 'items'> {
  count: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashBoardStupidMetaDataModel extends DashBoardMetaDataModel {}
