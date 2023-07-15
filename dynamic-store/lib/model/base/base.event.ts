// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export interface BaseEventsAbstract<TType, TData = unknown> {
  eventType: TType;
  data: TData;
}
