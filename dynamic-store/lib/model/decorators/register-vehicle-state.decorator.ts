import { VehicleContainerEnum } from '../enums/vehicle-container.enum';
import { StateBuildersUtils } from '../../logic/utils/state-builders.utils';
import { VehicleEnum } from '../domain/vehicle.enum';

type Type<T> = new (...args: Array<T>) => T;

interface MapDecoratorItem {
  name: string;
  type: Type<any>;
}

const MapDecorator: Map<string, MapDecoratorItem> = new Map();

export function registerVehicleState<T>(
  container: VehicleContainerEnum,
  stateName: VehicleEnum
): (target: Type<any>) => void {
  return (target: Type<T>): void => {
    const name = StateBuildersUtils.buildRegisterStateName(container, stateName);
    checkExistInRegister(name);
    MapDecorator.set(name, { name: stateName, type: target });
  };
}

export function getRegisterVehicleState<T>(
  container: VehicleContainerEnum,
  stateName: VehicleEnum
): Type<T> {
  const name = StateBuildersUtils.buildRegisterStateName(container, stateName);
  if (!MapDecorator.has(name)) {
    throw new Error(
      `You should first decorate state: ${name} using decorator : @${registerVehicleState.name}`
    );
  }
  const item = MapDecorator.get(name)!;
  return <Type<T>>item.type;
}

function checkExistInRegister(name: string): void {
  const element = MapDecorator.get(name);
  if (element !== undefined) {
    throw new Error(`AF element on key :${name} already registered in register`);
  }
}
