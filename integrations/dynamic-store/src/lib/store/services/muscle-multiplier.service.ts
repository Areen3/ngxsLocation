import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MuscleMultiplierService implements AbstractSpeedMultiplierService {
  getSpeed(_speed: number): number {
    return _speed * 1.1;
  }
}
