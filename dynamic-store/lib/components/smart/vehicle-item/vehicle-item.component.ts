import { Component, Input, OnInit } from '@angular/core';

import { SingleLocation, Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';
import { ChangeSpeedVehicleAction } from '../../../logic/base/state.actions';
import { VehicleState } from '../../../logic/base/vehicle.state';
import {
  VehicleItemEvents,
  VehicleItemEventType,
  VehicleItemRemoveVehicleEvent
} from '../../stupid/vehicle-item/vehicle-item.event';
import {
  VehicleItemStupidDataModel,
  VehicleItemStupidMetaDataModel
} from '../../../model/stupid/vehicle-item-stupid.model';

@Component({
  selector: 'vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.scss']
})
export class VehicleItemComponent implements OnInit {
  @Input()
  context: VehicleItemModel;
  data$: Observable<VehicleItemStupidDataModel>;
  metaData$: Observable<VehicleItemStupidMetaDataModel>;

  constructor(
    private readonly store: Store,
    private container: VehicleContainerManagerService
  ) {}

  outputEvents(event: VehicleItemEvents): void {
    switch (event.eventType) {
      case VehicleItemEventType.changeSpeed:
        this.ChangeSpeed();
        break;
      case VehicleItemEventType.removeVehicle:
        const removeEvent = <VehicleItemRemoveVehicleEvent>event;
        this.container.removeVehicle(removeEvent.data);
        this.RemoveVehicle();
        break;
    }
  }

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
    this.data$ = this.store.selectInContext(VehicleState.formData$, loc);
    this.metaData$ = this.store.selectInContext(VehicleState.formMetaData$, loc);
  }
}
