// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
import { IEmptyObject } from './base';

export interface BaseEventsAbstract<TType, TData = unknown> extends IEmptyObject {
  eventType: TType;
  data: TData;
}
