import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabEvents, TabsEventType } from './tabs.event';
import {
  TabsStupidDataModel,
  TabsStupidMetaDataModel
} from '../../../model/stupid/tabs-stupid.model';

@Component({
  selector: 'tabs-stupid',
  templateUrl: './tabs-stupid.component.html',
  styleUrls: ['./tabs-stupid.component.scss']
})
export class TabsStupidComponent {
  @Input()
  data: TabsStupidDataModel;
  @Input()
  metaData: TabsStupidMetaDataModel;
  @Output()
  eventEmitter: EventEmitter<TabEvents> = new EventEmitter<TabEvents>();

  onSelected(value: number) {
    this.eventEmitter.emit({
      eventType: TabsEventType.tabClicked,
      data: value
    });
  }
}
