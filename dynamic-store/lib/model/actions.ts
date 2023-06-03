export abstract class BaseAction {}

export abstract class BaseActionWithPayload<T> extends BaseAction {
  payload: T;

  constructor(data: T) {
    super();
    this.payload = data;
  }
}
