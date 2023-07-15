import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RangeLocations, SingleLocation, Store } from '@ngxs/store';
import {
  VehicleContainerStupidModelModel,
  VehicleContainerStupidViewModel
} from '../../../model/stupid/vehicle-container-stupid.model';
import {
  VehicleContainerAddVehicleEvent,
  VehicleContainerEvents,
  VehicleContainerEventType,
  VehicleContainerRemoveContainerEvent
} from '../../stupid/vehicle-container/vehicle-container.event';
import {
  AddVehicleAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from '../../../store/base/state.actions';
import { ActivatedRoute } from '@angular/router';
import {
  DashBoardElementsItemModel,
  DashBoardElementsModel
} from '../../../store/dash-board/dash-board-state.model';
import { VehicleContainerElementsModel } from '../../../store/base/vehicle-container-state.model';
import { SelectorBuildersUtils } from '../../../store/utils/selector-builders.utils';
import { DashBoardState } from '../../../store/dash-board/dash-board.state';

@Component({
  selector: 'vehicle-container',
  templateUrl: './vehicle-container.component.html',
  styleUrls: ['./vehicle-container.component.scss']
})
export class VehicleContainerComponent implements OnInit {
  elements: DashBoardElementsItemModel;
  model$: Observable<VehicleContainerStupidModelModel>;
  view$: Observable<VehicleContainerStupidViewModel>;
  elements$: Observable<VehicleContainerElementsModel>;

  constructor(
    private readonly store: Store,
    private route: ActivatedRoute,
    private readonly selectorBuilder: SelectorBuildersUtils
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const elements = <DashBoardElementsModel>(
      this.store.selectSnapshot(DashBoardState.formElements$)
    );
    this.elements = elements.items.find(item => item.id === id)!;
    const loc = SingleLocation.getLocation(this.elements.location);
    this.model$ = this.selectorBuilder.getFormModelVehicleContainer$(this.elements.type, loc);
    this.view$ = this.selectorBuilder.getFormViewVehicleContainer$(this.elements.type, loc);
    this.elements$ = this.selectorBuilder.getElementsVehicleContainer$(
      this.elements.type,
      loc
    );
  }

  outputEvents(event: VehicleContainerEvents): void {
    switch (event.eventType) {
      case VehicleContainerEventType.addVehicle:
        const addEvent = <VehicleContainerAddVehicleEvent>event;
        this.store.dispatchInLocation(
          new AddVehicleAppServiceAction({ container: this.elements, vehicle: addEvent.data }),
          RangeLocations.filterByContext(this.elements.type, this.elements.type)
        );
        break;
      case VehicleContainerEventType.removeContainer:
        const removeEvent = <VehicleContainerRemoveContainerEvent>event;
        this.store.dispatch(new RemoveVehicleContainerAppServiceAction(removeEvent.data));
        break;
    }
  }
}
