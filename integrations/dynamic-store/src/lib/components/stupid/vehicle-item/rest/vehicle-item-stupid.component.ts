import { Component } from '@angular/core';
import { VehicleItemModel } from '../../../../model/store/vehicle-item.model';
import { VehicleItemEvents } from '../base/vehicle-item.event';
import {
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../../../model/stupid/vehicle-item-stupid.model';
import { VehicleBaseStupidComponent } from '../base/vehicle-base-stupid.component';
import { registerComponent } from '../../../../model/decorators/register-vehicle-component.decorator';
import { VehicleEnum } from '../../../../model/enums/vehicle.enum';

@Component({
  selector: 'vehicle-item-stupid',
  templateUrl: './vehicle-item-stupid.component.html',
  styleUrls: ['./vehicle-item-stupid.component.scss']
})
@registerComponent(VehicleEnum.truck)
@registerComponent(VehicleEnum.car)
@registerComponent(VehicleEnum.motorBike)
export class VehicleItemStupidComponent<
  TEvents extends VehicleItemEvents,
  TModel extends VehicleItemStupidModelModel,
  TView extends VehicleItemStupidViewModel,
  TElements extends VehicleItemModel = VehicleItemModel
> extends VehicleBaseStupidComponent<TEvents, TModel, TView, TElements> {}
