// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEmptyObject {}

export interface IElementItems<T extends IEmptyObject> {
  items: Array<T>;
}
