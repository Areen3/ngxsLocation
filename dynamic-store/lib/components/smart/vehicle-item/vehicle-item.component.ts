import { Component, Input, OnInit } from '@angular/core';

import { SingleLocation, Store } from '@ngxs/store';

import { Observable } from 'rxjs';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import {
  VehicleItemEvents,
  VehicleItemEventType,
  VehicleItemRemoveVehicleEvent
} from '../../stupid/vehicle-item/vehicle-item.event';
import {
  VehicleItemStupidDataModel,
  VehicleItemStupidMetaDataModel
} from '../../../model/stupid/vehicle-item-stupid.model';
import { VehicleDependencyInjectState } from '../../../store/dependency-incject/vehicle-dependency-inject.state';
import {
  ChangeSpeedAppServiceAction,
  RemoveVehicleAppServiceAction
} from '../../../store/base/state.actions';

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

  constructor(private readonly store: Store) {}

  outputEvents(event: VehicleItemEvents): void {
    switch (event.eventType) {
      case VehicleItemEventType.changeSpeed:
        this.store.dispatch(new ChangeSpeedAppServiceAction(this.context));
        break;
      case VehicleItemEventType.removeVehicle:
        const removeEvent = <VehicleItemRemoveVehicleEvent>event;
        this.store.dispatch(new RemoveVehicleAppServiceAction(removeEvent.data));
        break;
    }
  }

  ngOnInit(): void {
    const loc = SingleLocation.getLocation(this.context.location);
    this.data$ = this.store.selectInContext(VehicleDependencyInjectState.formData$, loc);
    this.metaData$ = this.store.selectInContext(
      VehicleDependencyInjectState.formMetaData$,
      loc
    );
  }
}
