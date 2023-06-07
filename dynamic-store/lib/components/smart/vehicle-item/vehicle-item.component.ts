import { Component, Input, OnInit } from '@angular/core';

import { SingleLocation, Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { VehicleModel } from '../../../model/domain/vehicle.model';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';
import { ChangeSpeedVehicleAction } from '../../../logic/base/state.actions';
import { VehicleState } from '../../../logic/base/vehicle.state';

@Component({
  selector: 'vehicle-item',
  templateUrl: './vehicle-item.component.html'
})
export class VehicleItemComponent implements OnInit {
  @Input()
  context: VehicleItemModel;
  vehicle$: Observable<VehicleModel>;

  constructor(
    private readonly store: Store,
    private container: VehicleContainerManagerService
  ) {}

  ChangeSpeed(): void {
    const newSpeed = Math.floor(Math.random() * 100);
    this.store.dispatchInLocation(
      new ChangeSpeedVehicleAction(newSpeed),
      SingleLocation.getLocation(this.context.location)
    );
  }

  RemoveVehicle(): void {
    this.container.removeVehicle(this.context);
  }

  ngOnInit(): void {
    const loc = SingleLocation.getLocation(this.context.location);
    this.vehicle$ = this.store.selectInContext(VehicleState.vehicle$, loc);
  }
}
