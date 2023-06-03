import { NgModule } from '@angular/core';
import { ContainerManagerComponent } from './components/smart-components/container-manager/container-manager.component';
import { DashBoardComponent } from './components/smart-components/dash-board/dash-board.component';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { DashBoardState } from './logic/dash-board/dash-board.state';
import { StateBuildersUtils } from './logic/utils/state-builders.utils';
import { VehicleContainerManagerService } from './logic/services/vehicle-container-manager.service';
import { VehicleContainerState } from './logic/container/vehicle-container.state';

@NgModule({
  declarations: [ContainerManagerComponent, DashBoardComponent],
  imports: [CommonModule, NgxsModule.forFeature([DashBoardState])],
  exports: [ContainerManagerComponent, DashBoardComponent],
  providers: [StateBuildersUtils, VehicleContainerManagerService, VehicleContainerState]
})
export class LibModule {}
