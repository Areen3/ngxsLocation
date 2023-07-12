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
import { FeRouteModule } from './fe-route.module';
import { TabsStupidComponent } from './components/stupid/tabs/tabs-stupid.component';
import { RouteReuseStrategy } from '@angular/router';
import { ParamChangeRouteResultStrategy } from './guards/strategy/params-change-route-strategy';
import { SimulateBackendService } from './backend/simulate-backend.service';
import { VehicleContainerDalService } from './backend/vehicle-container-dal.service';
import { AbstractVehicleContainerState } from './store/base/abstract-vehicle-container.state';
import { SelectorBuildersUtils } from './logic/utils/selector-builders.utils';
import { VehicleSingleResponsibilityContainerState } from './store/single-responsibility/container/vehicle-single-responsibility-container.state';
import { RoutingSingleResponsibilityState } from './store/single-responsibility/base/routing-single-responsibility.state';
import { FormModelSingleResponsibilityState } from './store/single-responsibility/base/form-model-single-responsibility-state.service';
import { FormViewSingleResponsibilityState } from './store/single-responsibility/base/form-view-single-responsibility-state.service';
import { FormElementsSingleResponsibilityState } from './store/single-responsibility/base/form-elements-single-responsibility-state.service';
import { ItemElementsSingleResponsibilityState } from './store/single-responsibility/base/item-elements-single-responsibility-state.service';
import { FormModelVehicleContainerState } from './store/single-responsibility/container/form-model-vehicle-container-state.service';
import { FormViewVehicleContainerState } from './store/single-responsibility/container/form-view-vehicle-container-state.service';
import { FormElementsVehicleContainerState } from './store/single-responsibility/container/formelements-vehicle-container-state.service';
import { LocationBuildersUtils } from './logic/utils/location-builders.utils';
import { HostAreaAccessService } from './store/single-responsibility/area-services/host-area-access.service';
import { CrudSrVehicleContainerState } from './store/single-responsibility/container/crud-sr-vehicle-container.state';
import { BaseVehicleAppServiceState } from './store/base/base-vehicle-app-service.state';
import { DynamicVehicleAppServiceState } from './store/dynamic/dynamic-vehicle-app-service.state';
import { DependencyInjectedVehicleAppServiceState } from './store/dependency-incject/dependency-injected-vehicle-app-service.state';
import { SingleResponsibilityVehicleAppServiceState } from './store/single-responsibility/app-services/single-responsibility-vehicle-app-service.state';

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
  imports: [CommonModule, NgxsModule.forFeature([DashBoardState]), FeRouteModule],
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
    FormModelSingleResponsibilityState,
    FormElementsSingleResponsibilityState,
    ItemElementsSingleResponsibilityState,
    FormViewSingleResponsibilityState,
    FormModelVehicleContainerState,
    FormViewVehicleContainerState,
    FormElementsVehicleContainerState,
    LocationBuildersUtils,
    HostAreaAccessService,
    CrudSrVehicleContainerState,
    BaseVehicleAppServiceState,
    DynamicVehicleAppServiceState,
    DependencyInjectedVehicleAppServiceState,
    SingleResponsibilityVehicleAppServiceState
  ]
})
export class LibModule {
  constructor(private readonly simulate: SimulateBackendService) {
    this.simulate.runSimulate();
  }
}
