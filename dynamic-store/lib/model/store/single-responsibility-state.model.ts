import { RoutingLoadModel } from './routing-load.model';
import { ElementContextDataModel, ElementsDataModel } from '../domain/elementDataModel';

export type RoutingSingleResponsibilityStateModel = RoutingLoadModel;

export interface ContextSingleResponsibilityStateModel<T extends ElementContextDataModel> {
  context: ElementsDataModel<T>;
}
