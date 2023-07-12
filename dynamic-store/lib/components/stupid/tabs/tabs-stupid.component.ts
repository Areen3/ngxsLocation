import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabEvents, TabsEventType } from './tabs.event';
import {
  TabsStupidDataModel,
  TabsStupidMetaDataModel
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
  TModel = TabsStupidDataModel,
  TView = TabsStupidMetaDataModel,
  TEvents extends TabEvents = TabEvents
> implements BaseStupidInputInterface<TModel, TView>, BaseStupidOutputInterface<TEvents>
{
  @Input()
  data: TModel;
  @Input()
  metaData: TView;
  @Output()
  eventEmitter: EventEmitter<TEvents> = new EventEmitter<TEvents>();

  onSelected(value: number) {
    this.eventEmitter.emit(<TEvents>{
      eventType: TabsEventType.tabClicked,
      data: value
    });
  }
}
