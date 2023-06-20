import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleLocation, Store } from '@ngxs/store';
import { DashBoardContextItemModel } from '../../../logic/dash-board/dash-board-state.model';
import { VehicleContainerManagerService } from '../../../logic/services/vehicle-container-manager.service';
import { VehicleContainerState } from '../../../logic/vehicle-container/vehicle-container.state';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidMetaDataModel
} from '../../../model/stupid/vehicle-container-stupid.model';
import {
  VehicleContainerAddVehicleEvent,
  VehicleContainerEvents,
  VehicleContainerEventType,
  VehicleContainerRemoveContainerEvent
} from '../../stupid/vehicle-container/vehicle-container.event';
import { VehicleContainerContextModel } from '../../../logic/vehicle-container/vehicle-container-state.model';

@Component({
  selector: 'vehicle-container',
  templateUrl: './vehicle-container.component.html',
  styleUrls: ['./vehicle-container.component.scss']
})
export class VehicleContainerComponent implements OnInit {
  @Input()
  context: DashBoardContextItemModel;
  data$: Observable<VehicleContainerStupidDataModel>;
  metaData$: Observable<VehicleContainerStupidMetaDataModel>;
  context$: Observable<VehicleContainerContextModel>;

  constructor(
    private readonly container: VehicleContainerManagerService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const loc = SingleLocation.getLocation(this.context.location);
    this.data$ = this.store.selectInContext(VehicleContainerState.formData$, loc);
    this.metaData$ = this.store.selectInContext(VehicleContainerState.formMetaData$, loc);
    this.context$ = this.store.selectInContext(VehicleContainerState.context$, loc);
  }

  outputEvents(event: VehicleContainerEvents): void {
    switch (event.eventType) {
      case VehicleContainerEventType.addVehicle:
        const addEvent = <VehicleContainerAddVehicleEvent>event;
        this.container.addVehicle(this.context, addEvent.data);
        break;
      case VehicleContainerEventType.removeContainer:
        const removeEvent = <VehicleContainerRemoveContainerEvent>event;
        this.container.removeContainer(removeEvent.data);
        break;
    }
  }
}
