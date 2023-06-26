import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutingPathEnum } from './model/enums/routing-path-enum';
import { DashBoardComponent } from './components/smart/dash-board/dash-board.component';

const routes: Routes = [
  {
    path: RoutingPathEnum.dashboard,
    component: DashBoardComponent
    // canActivate: [AuthorizedGuard, DashboardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeRouteModule {}
