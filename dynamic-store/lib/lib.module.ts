import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { DashBoardState } from './logic/dash-board/dash-board.state';
import { StateBuildersUtils } from './logic/utils/state-builders.utils';
import { VehicleContainerComponent } from './components/smart/vehicle-container/vehicle-container.component';
import { VehicleItemComponent } from './components/smart/vehicle-item/vehicle-item.component';
import { DashBoardComponent } from './components/smart/dash-board/dash-board.component';
import { DashBoardStupidComponent } from './components/stupid/dash-board/dash-board-stupid.component';
import { VehicleContainerStupidComponent } from './components/stupid/vehicle-container/vehicle-container-stupid.component';
import { VehicleItemStupidComponent } from './components/stupid/vehicle-item/vehicle-item-stupid.component';
import { VehicleDependencyInjectContainerState } from './store/dependency-incject/vehicle-dependency-inject-container.state';
import { CarDependencyInjectState } from './store/dependency-incject/car-dependency-inject.state';
import { MotoBikeDependencyInjectState } from './store/dependency-incject/moto-bike-dependency-inject.state';
import { TruckDependencyInjectState } from './store/dependency-incject/truck-dependency-inject.state';
import { BikeDependencyInjectState } from './store/dependency-incject/bike-dependency-inject.state';
import { BikeDynamicState } from './store/dynamic/bike-dynamic.state';
import { CarDynamicState } from './store/dynamic/car-dynamic.state';
import { MotoBikeDynamicState } from './store/dynamic/moto-bike-dynamic.state';
import { TruckDynamicState } from './store/dynamic/truck-dynamic.state';
import { VehicleDynamicState } from './store/dynamic/vehicle-dynamic.state';
import { VehicleDynamicContainerState } from './store/dynamic/vehicle-dynamic-container.state';
import { VehicleAppServiceState } from './store/app-service/vehicle-app-service.state';
import { FeRouteModule } from './fe-route.module';
import { TabsStupidComponent } from './components/stupid/tabs/tabs-stupid.component';
import { RouteReuseStrategy } from '@angular/router';
import { ParamChangeRouteResultStrategy } from './guards/strategy/params-change-route-strategy';
import { SimulateBackendService } from './backend/simulate-backend.service';
import { VehicleContainerDalService } from './backend/vehicle-container-dal.service';
import { AbstractVehicleContainerState } from './store/app-service/abstract-vehicle-container.state';
import { SelectorBuildersUtils } from './logic/utils/selector-builders.utils';
import { VehicleSingleResponsibilityContainerState } from './store/single-responsibility/vehicle-single-responsibility-container.state';
import { RoutingSingleResponsibilityState } from './store/single-responsibility/routing-single-responsibility.state';
import { FormDataSingleResponsibilityState } from './store/single-responsibility/form-data-single-responsibility.state';
import { FormMetaDataSingleResponsibilityState } from './store/single-responsibility/form-meta-data-single-responsibility.state';
import { FormContextSingleResponsibilityState } from './store/single-responsibility/form-context-single-responsibility.state';

@NgModule({
  declarations: [
    VehicleContainerComponent,
    VehicleItemComponent,
    DashBoardComponent,
    DashBoardStupidComponent,
    VehicleContainerStupidComponent,
    VehicleItemStupidComponent,
    TabsStupidComponent
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([DashBoardState, VehicleAppServiceState]),
    FeRouteModule
  ],
  exports: [
    VehicleContainerComponent,
    VehicleItemComponent,
    DashBoardComponent,
    DashBoardStupidComponent,
    VehicleContainerStupidComponent,
    VehicleItemStupidComponent
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: ParamChangeRouteResultStrategy
    },
    StateBuildersUtils,
    VehicleAppServiceState,
    VehicleDependencyInjectContainerState,
    CarDependencyInjectState,
    MotoBikeDependencyInjectState,
    TruckDependencyInjectState,
    BikeDependencyInjectState,
    BikeDynamicState,
    CarDynamicState,
    MotoBikeDynamicState,
    TruckDynamicState,
    VehicleDynamicState,
    VehicleDynamicContainerState,
    SimulateBackendService,
    VehicleContainerDalService,
    AbstractVehicleContainerState,
    SelectorBuildersUtils,
    VehicleSingleResponsibilityContainerState,
    RoutingSingleResponsibilityState,
    FormDataSingleResponsibilityState,
    FormContextSingleResponsibilityState,
    FormMetaDataSingleResponsibilityState
  ]
})
export class LibModule {
  constructor(private readonly simulate: SimulateBackendService) {
    this.simulate.runSimulate();
  }
}
