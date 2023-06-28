import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutingPathEnum } from './model/enums/routing-path-enum';
import { DashBoardComponent } from './components/smart/dash-board/dash-board.component';
import { VehicleContainerComponent } from './components/smart/vehicle-container/vehicle-container.component';
import { VehicleContainerAddGuard } from './guards/vehicle-container/vehicle-container-add.guard';
import { DashBoardAddGuard } from './guards/dash-board/dash-board-add-guard.service';
import { VehicleContainerGuard } from './guards/vehicle-container/vehicle-container.guard';

const routes: Routes = [
  {
    path: `${RoutingPathEnum.dashboard}`,
    component: DashBoardComponent,
    canActivate: [DashBoardAddGuard],
    children: [
      {
        path: `${RoutingPathEnum.vehicleContainer}/add/:type`,
        component: VehicleContainerComponent,
        canActivate: [VehicleContainerAddGuard]
      },
      {
        path: `${RoutingPathEnum.vehicleContainer}/:id`,
        component: VehicleContainerComponent,
        canActivate: [VehicleContainerGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeRouteModule {}
