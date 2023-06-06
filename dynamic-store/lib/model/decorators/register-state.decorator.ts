type Type<T> = new (...args: Array<T>) => T;

interface MapDecoratorItem {
  name: string;
  type: Type<any>;
}

const MapDecorator: Map<string, MapDecoratorItem> = new Map();

export function registerState<T>(stateName: string): (target: Type<any>) => void {
  return (target: Type<T>): void => {
    checkExistInRegister(stateName);
    MapDecorator.set(stateName, { name: stateName, type: target });
  };
}

export function getRegisterState<T>(stateName: string): Type<T> {
  if (!MapDecorator.has(stateName)) {
    throw new Error(
      `You should first decorate state: ${stateName} using decorator : @${registerState.name}`
    );
  }
  const item = MapDecorator.get(stateName)!;
  return <Type<T>>item.type;
}

function checkExistInRegister(name: string): void {
  const element = MapDecorator.get(name);
  if (element !== undefined) {
    throw new Error(`AF element on key :${name} already registered in register`);
  }
}
