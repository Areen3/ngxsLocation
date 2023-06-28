export interface ElementDataModel {
  name: string;
  id: number;
}

export interface ElementsDataModel<T extends ElementDataModel> {
  items: Array<T>;
}
