import { NgModule } from '@angular/core';
import { VehicleContainerManagerService } from './logic/services/vehicle-container-manager.service';
import { ContainerManagerComponent } from './components/smart-components/container-manager/container-manager.component';
import { DashBoardComponent } from './components/smart-components/dash-board/dash-board.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ContainerManagerComponent, DashBoardComponent],
  imports: [CommonModule],
  exports: [ContainerManagerComponent, DashBoardComponent],
  providers: [VehicleContainerManagerService]
})
export class LibModule {}
