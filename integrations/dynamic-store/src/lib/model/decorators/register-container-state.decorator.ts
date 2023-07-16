import { VehicleContainerEnum } from '../enums/vehicle-container.enum';

type Type<T> = new (...args: Array<T>) => T;

interface MapDecoratorItem {
  name: string;
  type: Type<any>;
}

const MapDecorator: Map<string, MapDecoratorItem> = new Map();

export function registerContainerState<T>(
  container: VehicleContainerEnum
): (target: Type<any>) => void {
  return (target: Type<T>): void => {
    checkExistInRegister(container);
    MapDecorator.set(container, { name: container, type: target });
  };
}

export function getRegisterContainerState<T>(container: VehicleContainerEnum): Type<T> {
  if (!MapDecorator.has(container)) {
    throw new Error(
      `You should first decorate state: ${name} using decorator : @${registerContainerState.name}`
    );
  }
  const item = MapDecorator.get(container)!;
  return <Type<T>>item.type;
}

function checkExistInRegister(name: string): void {
  const element = MapDecorator.get(name);
  if (element !== undefined) {
    throw new Error(`AF element on key :${name} already registered in register`);
  }
}
