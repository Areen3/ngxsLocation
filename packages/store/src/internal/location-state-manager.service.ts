import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { InternalStateOperations } from './state-operations';
import { MappedStore } from './internals';
import { UpdateState } from '../actions/actions';
import { NgxsLifeCycle, NgxsSimpleChange, StateContext } from '../symbols';
import { StateContextFactory } from './state-context-factory';
import { getValue, Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class LocationStateManager {
  constructor(
    private _internalStateOperations: InternalStateOperations,
    private _stateContextFactory: StateContextFactory
  ) {}

  prepareNewStates(mappedStores: MappedStore[], store: Store): Observable<any> {
    return this._internalStateOperations
      .getRootStateOperations()
      .dispatch(new UpdateState())
      .pipe(tap(() => this._invokeInitOnStates(mappedStores, store)));
  }

  prepareDeleteStates(mappedStores: MappedStore[]): Observable<any> {
    return of(this._internalStateOperations.getRootStateOperations()).pipe(
      tap(() => this.invokeDelete(mappedStores))
    );
  }

  private _invokeInitOnStates(mappedStores: MappedStore[], store: Store): void {
    for (const mappedStore of mappedStores) {
      const instance: NgxsLifeCycle = mappedStore.instance;

      if (instance.ngxsOnChanges) {
        store
          .select(state => getValue(state, mappedStore.path))
          .pipe(startWith(undefined), pairwise(), takeUntil(this._destroy$))
          .subscribe(([previousValue, currentValue]) => {
            const change = new NgxsSimpleChange(
              previousValue,
              currentValue,
              !mappedStore.isInitialised
            );
            instance.ngxsOnChanges!(change);
          });
      }

      if (instance.ngxsOnInit) {
        instance.ngxsOnInit(this._getStateContext(mappedStore));
      }

      mappedStore.isInitialised = true;
    }
  }

  private invokeDelete(mappedStores: MappedStore[]): void {
    for (const mappedStore of mappedStores) {
      const instance: NgxsLifeCycle = mappedStore.instance;
      if (instance && instance.ngxsOnDelete) {
        instance.ngxsOnDelete(this._getStateContext(mappedStore));
      }
    }
  }

  private _getStateContext(mappedStore: MappedStore): StateContext<any> {
    return this._stateContextFactory.createStateContext(mappedStore);
  }
}
