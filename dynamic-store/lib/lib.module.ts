import { NgModule } from '@angular/core';
import { DashBoardComponent } from './components/smart-components/dash-board/dash-board.component';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { DashBoardState } from './logic/dash-board/dash-board.state';
import { StateBuildersUtils } from './logic/utils/state-builders.utils';
import { VehicleContainerManagerService } from './logic/services/vehicle-container-manager.service';
import { VehicleContainerComponent } from './components/smart-components/vehicle-container/vehicle-container.component';
import { VehicleContainerState } from './logic/vehicle-container/vehicle-container.state';
import { VehicleItemComponent } from './components/smart-components/vehicle-item/vehicle-item.component';
import { MotoBikeStateService } from './logic/mechanical/moto-bike-state.service';
import { TruckStateService } from './logic/mechanical/truck-state.service';
import { BikeStateService } from './logic/muscle/bike-state.service';
import { CarStateService } from './logic/mechanical/car-state.service';

@NgModule({
  declarations: [VehicleContainerComponent, VehicleItemComponent, DashBoardComponent],
  imports: [CommonModule, NgxsModule.forFeature([DashBoardState])],
  exports: [VehicleContainerComponent, VehicleItemComponent, DashBoardComponent],
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
