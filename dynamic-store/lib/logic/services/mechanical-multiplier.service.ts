import { AbstractSpeedMultiplierService } from '../../model/abstract/abstract-speed-multiplier-.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MechanicalMultiplierService implements AbstractSpeedMultiplierService {
  getSpeed(_speed: number): number {
    return _speed * 2;
  }
}
