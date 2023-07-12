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
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../../model/stupid/vehicle-item-stupid.model';
import {
  ChangeSpeedAppServiceAction,
  RemoveVehicleAppServiceAction
} from '../../../store/base/state.actions';
import { ActivatedRoute } from '@angular/router';
import { DashBoardState } from '../../../logic/dash-board/dash-board.state';
import { SelectorBuildersUtils } from '../../../logic/utils/selector-builders.utils';

@Component({
  selector: 'vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.scss']
})
export class VehicleItemComponent implements OnInit {
  @Input()
  elements: VehicleItemModel;
  model$: Observable<VehicleItemStupidModelModel>;
  view$: Observable<VehicleItemStupidViewModel>;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly selectorBuilder: SelectorBuildersUtils
  ) {}

  outputEvents(event: VehicleItemEvents): void {
    switch (event.eventType) {
      case VehicleItemEventType.changeSpeed:
        this.store.dispatch(new ChangeSpeedAppServiceAction(this.elements));
        break;
      case VehicleItemEventType.removeVehicle:
        const removeEvent = <VehicleItemRemoveVehicleEvent>event;
        this.store.dispatch(new RemoveVehicleAppServiceAction(removeEvent.data));
        break;
    }
  }

  ngOnInit(): void {
    const containerId = Number(this.route.snapshot.paramMap.get('id'));
    const dashBoard = this.store.selectSnapshot(DashBoardState.formElements$);
    const item = dashBoard.items.find(item => item.id === containerId)!;
    const loc = SingleLocation.getLocation(this.elements.location);
    this.model$ = this.selectorBuilder.getFormModelVehicle$(item.type, loc);
    this.view$ = this.selectorBuilder.getFormViewVehicle$(item.type, loc);
  }
}
