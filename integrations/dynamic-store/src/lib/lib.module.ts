import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
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
import { TabsStupidComponent } from './components/stupid/tabs/tabs-stupid.component';
import { RouteReuseStrategy } from '@angular/router';
import { SimulateBackendService } from './backend/simulate-backend.service';
import { VehicleContainerDalService } from './backend/vehicle-container-dal.service';
import { AbstractVehicleContainerState } from './store/base/abstract-vehicle-container.state';
import { VehicleSingleResponsibilityContainerState } from './store/single-responsibility/container/vehicle-single-responsibility-container.state';
import { RoutingSingleResponsibilityState } from './store/single-responsibility/base/routing-single-responsibility.state';
import { FormModelSingleResponsibilityState } from './store/single-responsibility/base/form-model-single-responsibility-state.service';
import { FormViewSingleResponsibilityState } from './store/single-responsibility/base/form-view-single-responsibility-state.service';
import { FormElementsSingleResponsibilityState } from './store/single-responsibility/base/form-elements-single-responsibility-state.service';
import { ItemElementsSingleResponsibilityState } from './store/single-responsibility/base/item-elements-single-responsibility-state.service';
import { FormModelVehicleContainerState } from './store/single-responsibility/container/form-model-vehicle-container-state.service';
import { FormViewVehicleContainerState } from './store/single-responsibility/container/form-view-vehicle-container-state.service';
import { FormElementsVehicleContainerState } from './store/single-responsibility/container/formelements-vehicle-container-state.service';
import { HostAreaAccessService } from './store/single-responsibility/area-services/host-area-access.service';
import { CrudSrVehicleContainerState } from './store/single-responsibility/container/crud-sr-vehicle-container.state';
import { BaseVehicleAppServiceState } from './store/base/base-vehicle-app-service.state';
import { DynamicVehicleAppServiceState } from './store/dynamic/dynamic-vehicle-app-service.state';
import { DependencyInjectedVehicleAppServiceState } from './store/dependency-incject/dependency-injected-vehicle-app-service.state';
import { SingleResponsibilityVehicleAppServiceState } from './store/single-responsibility/app-services/single-responsibility-vehicle-app-service.state';
import { VehicleSingleResponsibilityState } from './store/single-responsibility/vehicles/vehicle-single-responsibility.state';
import { FormModelVehicleStateService } from './store/single-responsibility/vehicles/form-model-vehicle-state.service';
import { FormViewVehicleStateService } from './store/single-responsibility/vehicles/form-view-vehicle-state.service';
import { FormElementsVehicleStateService } from './store/single-responsibility/vehicles/form-elements-vehicle-state.service';
import { SpeedSrVehicleState } from './store/single-responsibility/vehicles/speed-sr-vehicle.state';
import { BikeSingleResponsibilityState } from './store/single-responsibility/vehicles/bike-single-responsibility.state';
import { MotoBikeSingleResponsibilityState } from './store/single-responsibility/vehicles/moto-bike-single-responsibility.state';
import { CarSingleResponsibilityState } from './store/single-responsibility/vehicles/car-single-responsibility.state';
import { TruckSingleResponsibilityState } from './store/single-responsibility/vehicles/truck-single-responsibility.state';
import { FeRouteModule } from './routing/fe-route.module';
import { ParamChangeRouteResultStrategy } from './routing/params-change-route-strategy';
import { SelectorBuildersUtils } from './store/utils/selector-builders.utils';
import { LocationBuildersUtils } from './store/utils/location-builders.utils';
import { DashBoardState } from './store/dash-board/dash-board.state';
import { StateBuildersUtils } from './store/utils/state-builders.utils';
import { DynamicModule } from 'ng-dynamic-component';

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
    NgxsModule.forFeature([DashBoardState]),
    FeRouteModule,
    DynamicModule
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
    SingleResponsibilityVehicleAppServiceState,
    VehicleSingleResponsibilityState,
    FormModelVehicleStateService,
    FormViewVehicleStateService,
    SpeedSrVehicleState,
    FormElementsVehicleStateService,
    BikeSingleResponsibilityState,
    CarSingleResponsibilityState,
    MotoBikeSingleResponsibilityState,
    TruckSingleResponsibilityState
  ]
})
export class LibModule {
  constructor(private readonly simulate: SimulateBackendService) {
    this.simulate.runSimulate();
  }
}
