import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { createSelector, SingleLocation, Store } from '@ngxs/store';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import {
  VehicleContainerStupidDataModel,
  VehicleContainerStupidMetaDataModel
} from '../../model/stupid/vehicle-container-stupid.model';
import { getRegisterContainerState } from '../../model/decorators/register-container-state.decorator';
import { getRegisterSelectedMethod } from '../../model/decorators/register-selector-method.decorator';
import { MethodSelectorEnum } from '../../model/enums/method-selector.enum';
import { VehicleContainerContextModel } from '../vehicle-container/vehicle-container-state.model';
import { LocationBuildersUtils } from './location-builders.utils';
import { StateNamesEnum } from '../../model/store/state-names.enum';

@Injectable()
export class SelectorBuildersUtils {
  constructor(
    private readonly store: Store,
    private readonly locBuilder: LocationBuildersUtils
  ) {}

  getFormDataVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerStupidDataModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedMethod(myType, MethodSelectorEnum.formData$);
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formData);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getFormMetaDataVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerStupidMetaDataModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedMethod(myType, MethodSelectorEnum.formMetaData$);
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formMetaData);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getContextVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerContextModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedMethod(myType, MethodSelectorEnum.formContext$);
    const myLoc = this.locBuilder.convertLocation(loc.path, type, StateNamesEnum.formContext);
    return this.store.selectInContext(
      this.getSelector(type, myLoc, mySelector.descriptor.value, mySelector.name),
      myLoc
    );
  }

  getRoutingVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerContextModel> {
    const myType = type === VehicleContainerEnum.singleResponsibilityStore ? '' : type;
    const mySelector = getRegisterSelectedMethod(myType, MethodSelectorEnum.routing$);
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
      this.buildCreationMetaData(stateType, selectorName, loc)
    );
  }

  private buildCreationMetaData(
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
