import { IEmptyObject } from '../base/base';
import { RoutingLoadModel } from './routing-load.model';
import { StateContext } from '@ngxs/store';

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

export interface RoutingSingleResponsibilityStateModel {
  routing: RoutingLoadModel;
}

export interface BaseSimpleStoreModel<
  Data extends IEmptyObject,
  MetaData extends IEmptyObject,
  Context extends IEmptyObject
> extends DataSingleResponsibilityStoreModel<Data>,
    MetaDataSingleResponsibilityStoreModel<MetaData>,
    ContextSingleResponsibilityStoreModel<Context> {}

export interface HostDataAreaAccessModel<TData> {
  data: StateContext<TData>;
}

export interface HostMetaDataAreaAccessModel<TMetaData> {
  metaData: StateContext<TMetaData>;
}

export interface HostContextAreaAccessModel<TContext> {
  context: StateContext<TContext>;
}

export interface HostSingleResponsibilityAreaAccessModel<
  TData = any,
  TMetaData = any,
  TContext = any
> extends HostDataAreaAccessModel<TData>,
    HostMetaDataAreaAccessModel<TMetaData>,
    HostContextAreaAccessModel<TContext> {}
