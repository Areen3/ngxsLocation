import { IEmptyObject } from '../base/base';

export interface BaseEventsAbstract<TType, TData extends IEmptyObject = IEmptyObject> {
  eventType: TType;
  data: TData;
}
