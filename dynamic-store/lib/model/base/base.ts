// eslint-disable-next-line @typescript-eslint/no-empty-interface

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEmptyObject {}

export interface IElementItems<T extends IEmptyObject> {
  items: Array<T>;
}

export interface IEntity extends IEmptyObject {
  id: number;
}
