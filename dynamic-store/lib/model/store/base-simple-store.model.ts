import { RoutingLoadModel } from './routing-load.model';
import { StateContext } from '@ngxs/store';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataSingleResponsibilityStoreModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ViewSingleResponsibilityStoreModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContextSingleResponsibilityStoreModel {}

export interface RoutingSingleResponsibilityStateModel {
  routing: RoutingLoadModel;
}

export interface BaseSimpleStoreModel
  extends DataSingleResponsibilityStoreModel,
    ViewSingleResponsibilityStoreModel,
    ContextSingleResponsibilityStoreModel {}

export interface HostDataAreaAccessModel<TData> {
  model: StateContext<TData>;
}

export interface HostViewAreaAccessModel<TView> {
  view: StateContext<TView>;
}

export interface HostContextAreaAccessModel<TContext> {
  elements: StateContext<TContext>;
}

export interface HostSingleResponsibilityAreaAccessModel<
  TModel = any,
  TView = any,
  TElements = any
> extends HostDataAreaAccessModel<TModel>,
    HostViewAreaAccessModel<TView>,
    HostContextAreaAccessModel<TElements> {}
