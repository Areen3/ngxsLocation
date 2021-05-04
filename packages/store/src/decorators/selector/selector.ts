import { throwSelectorDecoratorError } from '../../configs/messages.config';
import { createSelector } from '../../utils/selector-utils';
import { SelectorSpec, SelectorType } from './symbols';

/**
 * Decorator for memoizing a state selector.
 */
export function Selector<T>(selectors?: T[]): SelectorType<T> {
  return <U>(
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<SelectorSpec<T, U>>
  ): TypedPropertyDescriptor<SelectorSpec<T, U>> | void => {
    // Caretaker note: we have still left the `typeof` condition in order to avoid
    // creating a breaking change for projects that still use the View Engine.
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      const isNotMethod = !(descriptor && descriptor.value !== null);

      if (isNotMethod) {
        throwSelectorDecoratorError();
      }
    }

    const originalFn = descriptor.value;
    let memoizedFn: any = null;
    const newDescriptor = {
      configurable: true,
      get() {
        // Selector initialisation deferred to here so that it is at runtime, not decorator parse time
        memoizedFn =
          memoizedFn ||
          createSelector(selectors, originalFn as any, {
            containerClass: target,
            selectorName: key.toString(),
            location: <any>undefined,
            getSelectorOptions() {
              return {};
            }
          });
        return memoizedFn;
      }
    };
    // Add hidden property to descriptor
    (<any>newDescriptor)['originalFn'] = originalFn;
    return newDescriptor;
  };
}
