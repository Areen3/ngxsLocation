import { Component, Input, OnInit } from '@angular/core';
import { VehicleContainerManagerService } from '../../logic/services/vehicle-container-manager.service';
import { DashBoardItemModel } from '../../logic/dash-board/dash-board-state.model';
import { VehicleEnum } from '../../model/domain/vehicle.enum';
import { Observable } from 'rxjs';
import { VehicleContainersModel } from '../../model/store/vehicle-containers.model';
import { SingleLocation, Store } from '@ngxs/store';
import { VehicleContainerState } from '../../logic/vehicle-container/vehicle-container.state';

@Component({
  selector: 'vehicle-container',
  templateUrl: './vehicle-container.component.html'
})
export class VehicleContainerComponent implements OnInit {
  @Input()
  data: DashBoardItemModel;
  dropDownData: Array<string> = Object.values(VehicleEnum);
  vehicles$: Observable<VehicleContainersModel['vehicles']>;

  constructor(
    private readonly container: VehicleContainerManagerService,
    private readonly store: Store
  ) {}

  RemoveContainer() {
    this.container.removeContainer(this.data);
  }

  AddVehicle(vehicle: string): void {
    this.container.addVehicle(this.data, <VehicleEnum>vehicle);
  }

  ngOnInit(): void {
    const loc = SingleLocation.getLocation(this.data.location);
    this.vehicles$ = this.store.selectInContext(VehicleContainerState.containers$, loc);
  }
}
