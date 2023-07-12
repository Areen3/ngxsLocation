import { IEmptyObject } from '../../../model/base/base';
import { EventEmitter } from '@angular/core';

export interface BaseStupidInputInterface<
  TModel extends IEmptyObject,
  TView extends IEmptyObject
> {
  model: TModel;
  view: TView;
}

export interface BaseStupidOutputInterface<TEvents> {
  eventEmitter: EventEmitter<TEvents>;
}

export interface BaseStupidElementsInterface<TElements> {
  elements: TElements;
}
