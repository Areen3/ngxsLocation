import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabEvents, TabsEventType } from './tabs.event';
import {
  TabsStupidModelModel,
  TabsStupidViewModel
} from '../../../model/stupid/tabs-stupid.model';
import {
  BaseStupidInputInterface,
  BaseStupidOutputInterface
} from '../base/base-stupid-input-interface';

@Component({
  selector: 'tabs-stupid',
  templateUrl: './tabs-stupid.component.html',
  styleUrls: ['./tabs-stupid.component.scss']
})
export class TabsStupidComponent<
  TModel = TabsStupidModelModel,
  TView = TabsStupidViewModel,
  TEvents extends TabEvents = TabEvents
> implements BaseStupidInputInterface<TModel, TView>, BaseStupidOutputInterface<TEvents>
{
  @Input()
  model: TModel;
  @Input()
  view: TView;
  @Output()
  eventEmitter: EventEmitter<TEvents> = new EventEmitter<TEvents>();

  onSelected(value: number) {
    this.eventEmitter.emit(<TEvents>{
      eventType: TabsEventType.tabClicked,
      data: value
    });
  }
}
