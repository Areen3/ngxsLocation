import { Injectable } from '@angular/core';
import { RangeLocations, Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  AddVehicleContainerAppServiceAction,
  RemoveVehicleContainerAppServiceAction
} from '../store/base/state.actions';
import { VehicleContainerEnum } from '../model/enums/vehicle-container.enum';
import { DashBoardState } from '../store/dash-board/dash-board.state';

@Injectable()
export class SimulateBackendService {
  frequency = 2000;
  subject = new BehaviorSubject<number>(this.frequency);
  subjectPipe = this.subject.pipe(
    map(() => Math.random() * this.frequency + 1000),
    switchMap(value => forkJoin([of(value), timer(value)])),
    map(([value]) => value)
  );

  constructor(private store: Store) {}

  runSimulate(): void {
    combineLatest([this.store.select(DashBoardState.simulate$), this.subjectPipe])
      .pipe(
        filter(([simulate]) => simulate),
        map(([_simulate, value]) => value),
        switchMap(value =>
          value > (this.frequency + 1000) / 2 ? this.addContainer() : this.removeContainer()
        )
      )
      .subscribe(() => {
        this.subject.next(1);
      });
  }

  addContainer(): Observable<any> {
    const values = this.store.selectSnapshot(DashBoardState.formElements$);
    if (values.items.length > 5) return of(false);
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    const value = Object.values(VehicleContainerEnum).filter(
      (_item, index) => index === randomNumber
    );
    return this.store.dispatchInLocation(
      new AddVehicleContainerAppServiceAction({ vehicle: value[0], withStore: false }),
      RangeLocations.filterByContext(value[0], value[0])
    );
  }

  removeContainer(): Observable<any> {
    const values = this.store.selectSnapshot(DashBoardState.formElements$);
    if (values.items.length === 0) return of(false);
    const randomNumber = Math.floor(Math.random() * (values.items.length - 1));
    const vehicleContainer = values.items[randomNumber];
    return this.store.dispatchInLocation(
      new RemoveVehicleContainerAppServiceAction(vehicleContainer),
      RangeLocations.filterByContext(vehicleContainer.type, vehicleContainer.type)
    );
  }
}
