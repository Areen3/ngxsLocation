import { Component, Input, OnInit } from '@angular/core';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { SingleLocation, Store } from '@ngxs/store';
import { ChangeSpeedVehicleAction } from '../../../logic/base/state.actions';
import { Observable } from 'rxjs';
import { VehicleModel } from '../../../model/domain/vehicle.model';
import { VehicleState } from '../../../logic/base/vehicle.state';

@Component({
  selector: 'vehicle-item',
  templateUrl: './vehicle-item.component.html'
})
export class VehicleItemComponent implements OnInit {
  @Input()
  data: VehicleItemModel;
  vehicle$: Observable<VehicleModel>;

  constructor(private readonly store: Store) {}

  ChangeSpeed(): void {
    const newSpeed = Math.floor(Math.random() * 100);
    this.store.dispatchInLocation(
      new ChangeSpeedVehicleAction(newSpeed),
      SingleLocation.getLocation(this.data.location)
    );
  }

  ngOnInit(): void {
    const loc = SingleLocation.getLocation(this.data.location);
    this.vehicle$ = this.store.selectInContext(VehicleState.vehicle$, loc);
  }
}
