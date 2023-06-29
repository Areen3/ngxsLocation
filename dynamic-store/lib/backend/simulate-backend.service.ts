import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, timer } from 'rxjs';
import { DashBoardState } from '../logic/dash-board/dash-board.state';
import { filter, map, switchMap } from 'rxjs/operators';
import {
  AddVehicleBackendContainerAppServiceAction,
  RemoveVehicleBackendContainerAppServiceAction
} from '../store/app-service/state.actions';
import { VehicleContainerEnum } from '../model/enums/vehicle-container.enum';

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
    const values = this.store.selectSnapshot(DashBoardState.formContext$);
    if (values.items.length > 5) return of(false);
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    const value = Object.values(VehicleContainerEnum).filter(
      (_item, index) => index === randomNumber
    );
    return this.store.dispatch(new AddVehicleBackendContainerAppServiceAction(value[0]));
  }

  removeContainer(): Observable<any> {
    const values = this.store.selectSnapshot(DashBoardState.formContext$);
    if (values.items.length === 0) return of(false);
    const randomNumber = Math.floor(Math.random() * (values.items.length - 1));
    const vehicleContainer = values.items[randomNumber];
    return this.store.dispatch(
      new RemoveVehicleBackendContainerAppServiceAction(vehicleContainer)
    );
  }
}
