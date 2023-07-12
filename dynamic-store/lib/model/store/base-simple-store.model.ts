import { RoutingLoadModel } from './routing-load.model';
import { StateContext } from '@ngxs/store';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModelSingleResponsibilityStoreModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ViewSingleResponsibilityStoreModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ElementsSingleResponsibilityStoreModel {}

export interface RoutingSingleResponsibilityStateModel {
  routing: RoutingLoadModel;
}

export interface BaseSimpleStoreModel
  extends ModelSingleResponsibilityStoreModel,
    ViewSingleResponsibilityStoreModel,
    ElementsSingleResponsibilityStoreModel {}

export interface HostModelAreaAccessModel<TData> {
  model: StateContext<TData>;
}

export interface HostViewAreaAccessModel<TView> {
  view: StateContext<TView>;
}

export interface HostElementsAreaAccessModel<TElements> {
  elements: StateContext<TElements>;
}

export interface HostSingleResponsibilityAreaAccessModel<
  TModel = any,
  TView = any,
  TElements = any
> extends HostModelAreaAccessModel<TModel>,
    HostViewAreaAccessModel<TView>,
    HostElementsAreaAccessModel<TElements> {}
