import { SelectorSpec } from '../../../../packages/store/src/decorators/selector/symbols';
import { SelectorDef } from '../../../../packages/store/src/selectors';

interface MapDecoratorItem {
  name: string;
  type: {
    target: any;
    name: string;
    descriptor: PropertyDescriptor;
  };
}

const MapDecorator: Map<string, MapDecoratorItem> = new Map();

export function registerSelectorVehicleContainerMethod<T extends SelectorDef<any>>(
  key: string
): any {
  return <U>(
    target: any,
    name: string,
    descriptor: PropertyDescriptor
  ): TypedPropertyDescriptor<SelectorSpec<T, U>> | void => {
    descriptor ||= Object.getOwnPropertyDescriptor(target, name)!;
    const originalFn = descriptor?.value;
    if (originalFn && typeof originalFn !== 'function') {
      throw new Error(
        `You can only use this decorator ${registerSelectorVehicleContainerMethod.name} on method `
      );
    }
    const keyMap = buildName(key, name);
    checkExistInRegister(keyMap);
    MapDecorator.set(keyMap, {
      name: keyMap,
      type: {
        target,
        name,
        descriptor
      }
    });
    return descriptor;
  };
}

export function getRegisterSelectedVehicleContainerMethod(
  key: string,
  name: string
): MapDecoratorItem['type'] {
  if (!MapDecorator.has(buildName(key, name))) {
    throw new Error(
      `You should first decorate state: ${name} using decorator : @${registerSelectorVehicleContainerMethod.name}`
    );
  }
  const item = MapDecorator.get(buildName(key, name))!;
  return item.type;
}

function buildName(key: string, name: string): string {
  return `${key}-${name}`;
}

function checkExistInRegister(name: string): void {
  const element = MapDecorator.get(name);
  if (element !== undefined) {
    throw new Error(`AF element on key :${name} already registered in register`);
  }
}
