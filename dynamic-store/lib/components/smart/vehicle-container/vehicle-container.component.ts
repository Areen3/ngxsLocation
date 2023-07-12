import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RangeLocations, SingleLocation, Store } from '@ngxs/store';
import {
  DashBoardContextItemModel,
  DashBoardElementsModel
} from '../../../logic/dash-board/dash-board-state.model';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidViewModel
} from '../../../model/stupid/vehicle-container-stupid.model';
import {
  VehicleContainerAddVehicleEvent,
  VehicleContainerEvents,
  VehicleContainerEventType,
  VehicleContainerRemoveContainerEvent
} from '../../stupid/vehicle-container/vehicle-container.event';
import { VehicleContainerElementsModel } from '../../../logic/vehicle-container/vehicle-container-state.model';
import {
  AddVehicleAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from '../../../store/base/state.actions';
import { ActivatedRoute } from '@angular/router';
import { DashBoardState } from '../../../logic/dash-board/dash-board.state';
import { SelectorBuildersUtils } from '../../../logic/utils/selector-builders.utils';

@Component({
  selector: 'vehicle-container',
  templateUrl: './vehicle-container.component.html',
  styleUrls: ['./vehicle-container.component.scss']
})
export class VehicleContainerComponent implements OnInit {
  context: DashBoardContextItemModel;
  model$: Observable<VehicleContainerStupidDataModel>;
  view$: Observable<VehicleContainerStupidViewModel>;
  elements$: Observable<VehicleContainerElementsModel>;

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    private readonly selectorBuilder: SelectorBuildersUtils
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const contexts = <DashBoardElementsModel>(
      this.store.selectSnapshot(DashBoardState.formElements$)
    );
    this.context = contexts.items.find(item => item.id === id)!;
    const loc = SingleLocation.getLocation(this.context.location);
    this.model$ = this.selectorBuilder.getFormModelVehicleContainer$(this.context.type, loc);
    this.view$ = this.selectorBuilder.getFormViewVehicleContainer$(this.context.type, loc);
    this.elements$ = this.selectorBuilder.getElementsVehicleContainer$(this.context.type, loc);
  }

  outputEvents(event: VehicleContainerEvents): void {
    switch (event.eventType) {
      case VehicleContainerEventType.addVehicle:
        const addEvent = <VehicleContainerAddVehicleEvent>event;
        this.store.dispatchInLocation(
          new AddVehicleAppServiceAction({ container: this.context, vehicle: addEvent.data }),
          RangeLocations.filterByContext(this.context.type, this.context.type)
        );
        break;
      case VehicleContainerEventType.removeContainer:
        const removeEvent = <VehicleContainerRemoveContainerEvent>event;
        this.store.dispatch(new RemoveVehicleContainerAppServiceAction(removeEvent.data));
        break;
    }
  }
}
