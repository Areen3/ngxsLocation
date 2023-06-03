import { Injectable } from '@angular/core';

@Injectable()
export class StateBuildersUtils {
  buildStateName(name: string, count: number): string {
    return `${name}${count}`;
  }
}
