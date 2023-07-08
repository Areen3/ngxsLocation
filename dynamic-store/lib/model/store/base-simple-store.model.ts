import { IEmptyObject } from '../base/base';

export interface DataSingleResponsibilityStoreModel<Data extends IEmptyObject> {
  // określa dane domenowe jakei są przechowywane przez store
  data: Data;
}

export interface MetaDataSingleResponsibilityStoreModel<MetaData extends IEmptyObject> {
  // określa dane sterujące formularzem jakie mają być przechowywane przez store
  metaData: MetaData;
}

export interface ContextSingleResponsibilityStoreModel<Context extends IEmptyObject> {
  // określa lokalizację danego elementu w storze
  context: Context;
}

export interface BaseSimpleStoreModel<
  Data extends IEmptyObject,
  MetaData extends IEmptyObject,
  Context extends IEmptyObject
> extends DataSingleResponsibilityStoreModel<Data>,
    MetaDataSingleResponsibilityStoreModel<MetaData>,
    ContextSingleResponsibilityStoreModel<Context> {}
