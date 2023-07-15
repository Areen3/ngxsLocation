import { VehicleEnum } from '../enums/vehicle.enum';

type Type<T> = new (...args: Array<T>) => T;

interface MapDecoratorItem {
  name: string;
  type: Type<any>;
}

const MapDecorator: Map<string, MapDecoratorItem> = new Map();

export function registerVehicleService<T>(vehicle: VehicleEnum): (target: Type<any>) => void {
  return (target: Type<T>): void => {
    checkExistInRegister(vehicle);
    MapDecorator.set(vehicle, { name: vehicle, type: target });
  };
}

export function getRegisterVehicleService<T>(vehicle: VehicleEnum): Type<T> {
  if (!MapDecorator.has(vehicle)) {
    throw new Error(
      `You should first decorate service: ${vehicle} using decorator : @${registerVehicleService.name}`
    );
  }
  const item = MapDecorator.get(vehicle)!;
  return <Type<T>>item.type;
}

function checkExistInRegister(name: string): void {
  const element = MapDecorator.get(name);
  if (element !== undefined) {
    throw new Error(`AF element on key :${name} already registered in register`);
  }
}
