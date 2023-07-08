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

@Injectable()
export class SelectorBuildersUtils {
  constructor(private readonly store: Store) {}

  getFormDataVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerStupidDataModel> {
    const mySelector = getRegisterSelectedMethod(type, MethodSelectorEnum.formData$);
    return this.store.selectInContext(
      this.getSelector(type, loc, mySelector.descriptor.value, mySelector.name),
      loc
    );
  }

  getFormMetaDataVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerStupidMetaDataModel> {
    const mySelector = getRegisterSelectedMethod(type, MethodSelectorEnum.formMetaData$);
    return this.store.selectInContext(
      this.getSelector(type, loc, mySelector.descriptor.value, mySelector.name),
      loc
    );
  }

  getContextVehicleContainer$(
    type: VehicleContainerEnum,
    loc: SingleLocation
  ): Observable<VehicleContainerContextModel> {
    const mySelector = getRegisterSelectedMethod(type, MethodSelectorEnum.formContext$);
    return this.store.selectInContext(
      this.getSelector(type, loc, mySelector.descriptor.value, mySelector.name),
      loc
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
