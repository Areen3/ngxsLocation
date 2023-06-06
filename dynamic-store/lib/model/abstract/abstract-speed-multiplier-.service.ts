import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AbstractSpeedMultiplierService {
  getSpeed(_speed: number): number {
    throw new Error(
      `You should implement this method: ${AbstractSpeedMultiplierService.prototype.getSpeed.name}`
    );
  }
}
