import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutingPathEnum } from '../lib/model/enums/routing-path-enum';

const routes: Routes = [
  {
    path: '',
    redirectTo: RoutingPathEnum.dashboard,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
