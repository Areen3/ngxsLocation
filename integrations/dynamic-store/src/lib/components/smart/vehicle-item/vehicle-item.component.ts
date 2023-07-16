import { Component, Input, OnInit, Type } from '@angular/core';
import { SingleLocation, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { VehicleItemModel } from '../../../model/store/vehicle-item.model';
import {
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../../model/stupid/vehicle-item-stupid.model';
import {
  ChangeSpeedAppServiceAction,
  RemoveVehicleAppServiceAction
} from '../../../store/base/state.actions';
import { ActivatedRoute } from '@angular/router';
import { StateNamesEnum } from '../../../model/enums/state-names.enum';
import { DashBoardState } from '../../../store/dash-board/dash-board.state';
import { DashBoardElementsItemModel } from '../../../store/dash-board/dash-board-state.model';
import { SelectorBuildersUtils } from '../../../store/utils/selector-builders.utils';
import {
  VehicleItemEvents,
  VehicleItemEventType,
  VehicleItemRemoveVehicleEvent
} from '../../stupid/vehicle-item/base/vehicle-item.event';
import { OutputsType } from 'ng-dynamic-component/public-api';
import { getRegisterComponent } from '../../../model/decorators/register-vehicle-component.decorator';

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
  dashBoard: DashBoardElementsItemModel;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly selectorBuilder: SelectorBuildersUtils
  ) {}

  outputEvents(event: VehicleItemEvents): void {
    switch (event.eventType) {
      case VehicleItemEventType.changeSpeed:
        this.store.dispatchInLocation(
          new ChangeSpeedAppServiceAction(this.elements),
          SingleLocation.getLocation(StateNamesEnum.dashBoard).getChildLocation(
            this.dashBoard.type
          )
        );
        break;
      case VehicleItemEventType.removeVehicle:
        const removeEvent = <VehicleItemRemoveVehicleEvent>event;
        this.store.dispatchInLocation(
          new RemoveVehicleAppServiceAction(removeEvent.data),
          SingleLocation.getLocation(StateNamesEnum.dashBoard).getChildLocation(
            this.dashBoard.type
          )
        );
        break;
    }
  }

  ngOnInit(): void {
    const containerId = Number(this.route.snapshot.paramMap.get('id'));
    const dashBoard = this.store.selectSnapshot(DashBoardState.formElements$);
    this.dashBoard = dashBoard.items.find(item => item.id === containerId)!;
    const loc = SingleLocation.getLocation(this.elements.location);
    this.model$ = this.selectorBuilder.getFormModelVehicle$(this.dashBoard.type, loc);
    this.view$ = this.selectorBuilder.getFormViewVehicle$(this.dashBoard.type, loc);
  }

  getType(model: VehicleItemStupidModelModel): Type<any> {
    return getRegisterComponent(model.vehicle.type);
  }

  getInputs(
    model: VehicleItemStupidModelModel,
    view: VehicleItemStupidViewModel,
    elements: VehicleItemModel
  ): {
    model: VehicleItemStupidModelModel;
    view: VehicleItemStupidViewModel;
    elements: VehicleItemModel;
  } {
    return { view, elements, model };
  }

  getOutputs(): OutputsType {
    return <OutputsType>{
      eventEmitter: (data: VehicleItemEvents) => this.outputEvents(data)
    };
  }
}
