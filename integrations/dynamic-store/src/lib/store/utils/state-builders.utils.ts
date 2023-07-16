import { Injectable } from '@angular/core';
import { StateNamesEnum } from '../../model/enums/state-names.enum';
import { VehicleContainerEnum } from '../../model/enums/vehicle-container.enum';
import { VehicleEnum } from '../../model/enums/vehicle.enum';

@Injectable()
export class StateBuildersUtils {
  buildStateName(name: string, count: number): string {
    return `${name}${count}`;
  }
  static buildDynamicStateName(name: StateNamesEnum): string {
    return `${VehicleContainerEnum.dynamicStore}${name}`;
  }

  static buildDependencyInjectStateName(name: StateNamesEnum): string {
    return `${VehicleContainerEnum.dependencyInjectedStore}${name}`;
  }

  static buildSingleResponsibilityStateName(name: StateNamesEnum): string {
    return `${VehicleContainerEnum.singleResponsibilityStore}${name}`;
  }

  static buildRegisterStateName(container: VehicleContainerEnum, name: VehicleEnum): string {
    return `${container}_${name}`;
  }
}
