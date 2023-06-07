import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { DashBoardState } from './logic/dash-board/dash-board.state';
import { StateBuildersUtils } from './logic/utils/state-builders.utils';
import { VehicleContainerManagerService } from './logic/services/vehicle-container-manager.service';

import { VehicleContainerState } from './logic/vehicle-container/vehicle-container.state';

import { MotoBikeStateService } from './logic/mechanical/moto-bike-state.service';
import { TruckStateService } from './logic/mechanical/truck-state.service';
import { BikeStateService } from './logic/muscle/bike-state.service';
import { CarStateService } from './logic/mechanical/car-state.service';
import { VehicleContainerComponent } from './components/smart/vehicle-container/vehicle-container.component';
import { VehicleItemComponent } from './components/smart/vehicle-item/vehicle-item.component';
import { DashBoardComponent } from './components/smart/dash-board/dash-board.component';
import { DashBoardStupidComponent } from './components/stupid/dash-board/dash-board-stupid.component';
import { VehicleContainerStupidComponent } from './components/stupid/vehicle-container/vehicle-container-stupid.component';

@NgModule({
  declarations: [
    VehicleContainerComponent,
    VehicleItemComponent,
    DashBoardComponent,
    DashBoardStupidComponent,
    VehicleContainerStupidComponent
  ],
  imports: [CommonModule, NgxsModule.forFeature([DashBoardState])],
  exports: [
    VehicleContainerComponent,
    VehicleItemComponent,
    DashBoardComponent,
    DashBoardStupidComponent,
    VehicleContainerStupidComponent
  ],
  providers: [
    StateBuildersUtils,
    VehicleContainerManagerService,
    VehicleContainerState,
    CarStateService,
    MotoBikeStateService,
    TruckStateService,
    BikeStateService
  ]
})
export class LibModule {}
