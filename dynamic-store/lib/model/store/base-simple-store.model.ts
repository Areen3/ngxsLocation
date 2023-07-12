import { RoutingLoadModel } from './routing-load.model';
import { StateContext } from '@ngxs/store';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataSingleResponsibilityStoreModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MetaDataSingleResponsibilityStoreModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextSingleResponsibilityStoreModel {}

export interface RoutingSingleResponsibilityStateModel {
  routing: RoutingLoadModel;
}

export interface BaseSimpleStoreModel
  extends DataSingleResponsibilityStoreModel,
    MetaDataSingleResponsibilityStoreModel,
    ContextSingleResponsibilityStoreModel {}

export interface HostDataAreaAccessModel<TData> {
  model: StateContext<TData>;
}

export interface HostMetaDataAreaAccessModel<TMetaData> {
  view: StateContext<TMetaData>;
}

export interface HostContextAreaAccessModel<TContext> {
  elements: StateContext<TContext>;
}

export interface HostSingleResponsibilityAreaAccessModel<
  TData = any,
  TMetaData = any,
  TContext = any
> extends HostDataAreaAccessModel<TData>,
    HostMetaDataAreaAccessModel<TMetaData>,
    HostContextAreaAccessModel<TContext> {}
