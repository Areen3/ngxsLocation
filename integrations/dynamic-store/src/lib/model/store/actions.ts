import { NgxsAction } from '@ngxs/store';

export abstract class BaseAction extends NgxsAction {}

export abstract class BaseActionWithPayload<T> extends BaseAction {
  payload: T;

  constructor(data: T) {
    super();
    this.payload = data;
  }
}
