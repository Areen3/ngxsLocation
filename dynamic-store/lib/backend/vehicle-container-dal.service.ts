import { BackedDataAccessLayerService } from './backed-data-access-layer.service';
import { Injectable } from '@angular/core';
import { DashBoardContextItemModel } from '../logic/dash-board/dash-board-state.model';
import { Observable } from 'rxjs';

@Injectable()
export class VehicleContainerDalService extends BackedDataAccessLayerService<DashBoardContextItemModel> {
  getEntityByIdWithGenerate(id: number): Observable<DashBoardContextItemModel> {
    return super.getEntityById(id);
  }
}
