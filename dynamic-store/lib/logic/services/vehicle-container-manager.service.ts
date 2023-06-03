import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class VehicleContainerManagerService {
  addContainer(): void {
    of(true)
      .pipe(take(1))
      .subscribe(() => {
        console.log('kliknięte');
      });
  }

  removeContainer(element: number): void {
    of(element)
      .pipe(take(1))
      .subscribe(() => {
        console.log('usunięte');
      });
  }
}
