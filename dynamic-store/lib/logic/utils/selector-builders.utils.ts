import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { createSelector, SingleLocation, Store } from '@ngxs/store';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidViewModel
} from '../../model/stupid/vehicle-container-stupid.model';
import { getRegisterContainerState } from '../../model/decorators/register-container-state.decorator';
import { getRegisterSelectedVehicleContainerMethod } from '../../model/decorators/register-selector-vehicle-container-method.decorator';
import { MethodSelectorEnum } from '../../model/enums/method-selector.enum';
import { VehicleContainerElementsModel } from '../vehicle-container/vehicle-container-state.model';
import { LocationBuildersUtils } from './location-builders.utils';
import { StateNamesEnum } from '../../model/store/state-names.enum';
import { getRegisterSelectedVehicleMethod } from '../../model/decorators/register-selector-vehicle-method.decorator';
import {
  VehicleItemStupidModelModel,
  VehicleItemStupidViewModel
} from '../../model/stupid/vehicle-item-stupid.model';

@Injectable()
export class SelectorBuildersUtils {
  constructor(
    private readonly store: Store,
    private readonly locBuilder: LocationBuildersUtils
  ) {}

  getFormModelVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerStupidDataModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedVehicleContainerMethod(
      myType,
      MethodSelectorEnum.formModel$
    );
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formModel);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getFormViewVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerStupidViewModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedVehicleContainerMethod(
      myType,
      MethodSelectorEnum.formView$
    );
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formView);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getElementsVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerElementsModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedVehicleContainerMethod(
      myType,
      MethodSelectorEnum.formElements$
    );
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formContext);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getFormModelVehicle$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleItemStupidModelModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedVehicleMethod(myType, MethodSelectorEnum.formModel$);
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formModel);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }
  getFormViewVehicle$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleItemStupidViewModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedVehicleMethod(myType, MethodSelectorEnum.formModel$);
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formModel);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getRoutingVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerElementsModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedVehicleContainerMethod(
      myType,
      MethodSelectorEnum.routing$
    );
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.routing);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getSelector(
    type: VehicleContainerEnum,
    loc: SingleLocation,
    selectorMethod: any,
    selectorName: string
  ): any {
    const stateType: Type<any> = getRegisterContainerState(type);
    return createSelector(
      [stateType],
      selectorMethod,
      this.buildCreationView(stateType, selectorName, loc)
    );
  }

  private buildCreationView(
    containerClass: Type<any>,
    selectorName: string,
    location: SingleLocation
  ): {
    containerClass: Type<any>;
    selectorName: string;
    location: SingleLocation;
  } {
    return { containerClass, selectorName, location };
  }
}
