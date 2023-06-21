import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SingleLocation, Store } from '@ngxs/store';
import { DashBoardContextItemModel } from '../../../logic/dash-board/dash-board-state.model';
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
import { VehicleDependencyInjectContainerState } from '../../../store/dependency-incject/vehicle-dependency-inject-container.state';
import {
  AddVehicleAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from '../../../store/app-service/state.actions';

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

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    const loc = SingleLocation.getLocation(this.context.location);
    this.data$ = this.store.selectInContext(
      VehicleDependencyInjectContainerState.formData$,
      loc
    );
    this.metaData$ = this.store.selectInContext(
      VehicleDependencyInjectContainerState.formMetaData$,
      loc
    );
    this.context$ = this.store.selectInContext(
      VehicleDependencyInjectContainerState.context$,
      loc
    );
  }

  outputEvents(event: VehicleContainerEvents): void {
    switch (event.eventType) {
      case VehicleContainerEventType.addVehicle:
        const addEvent = <VehicleContainerAddVehicleEvent>event;
        this.store.dispatch(
          new AddVehicleAppServiceAction({ container: this.context, vehicle: addEvent.data })
        );
        break;
      case VehicleContainerEventType.removeContainer:
        const removeEvent = <VehicleContainerRemoveContainerEvent>event;
        this.store.dispatch(new RemoveVehicleContainerAppServiceAction(removeEvent.data));
        break;
    }
  }
}
