import { IEmptyObject } from '../../../model/base/base';
import { EventEmitter } from '@angular/core';

export interface BaseStupidInputInterface<
  TModel extends IEmptyObject,
  TView extends IEmptyObject
> {
  data: TModel;
  metaData: TView;
}

export interface BaseStupidOutputInterface<TEvents> {
  eventEmitter: EventEmitter<TEvents>;
}

export interface BaseStupidContextInterface<TElements> {
  context: TElements;
}
