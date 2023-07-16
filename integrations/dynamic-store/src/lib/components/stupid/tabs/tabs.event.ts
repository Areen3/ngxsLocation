import { BaseEventsAbstract } from '../../../model/base/base.event';

export enum TabsEventType {
  tabClicked = 'tabClicked'
}

export type TabClickedEvent = BaseEventsAbstract<TabsEventType, number>;
export type TabEvents = TabClickedEvent;
