import { BackedDataAccessLayerService } from './backed-data-access-layer.service';
import { Injectable } from '@angular/core';
import { DashBoardContextItemModel } from '../logic/dash-board/dash-board-state.model';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehicleEnum } from '../model/domain/vehicle.enum';

interface ContainerDto {
  container: DashBoardContextItemModel;
  vehicles: Array<VehicleEnum>;
}

@Injectable()
export class VehicleContainerDalService extends BackedDataAccessLayerService<DashBoardContextItemModel> {
  getEntityByIdWithGenerate(id: number): Observable<ContainerDto> {
    return from(super.getEntityById(id)).pipe(
      map<DashBoardContextItemModel, ContainerDto>(data => ({
        container: data,
        vehicles: this.generateVehicles()
      }))
    );
  }

  private generateVehicles(): ContainerDto['vehicles'] {
    const count = Math.floor(Math.random() * 4) + 1;
    const result: ContainerDto['vehicles'] = [];
    const enumCount = Object.values(VehicleEnum);
    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * (enumCount.length - 1)) + 1;
      const generateVehicle = enumCount.filter((_item, index) => index === randomNumber)[0];
      result.push(generateVehicle);
    }
    return result;
  }
}
