import { IEmptyObject } from '../base/base';

export interface BaseSimpleStoreModel<
  Data extends IEmptyObject,
  MetaData extends IEmptyObject,
  Context extends IEmptyObject
> {
  // określa dane domenowe jakei są przechowywane przez store
  data: Data;
  // określa dane sterujące formularzem jakie mają być przechowywane przez store
  metaData: MetaData;
  // określa lokalizację danego elementu w storze
  context: Context;
}
