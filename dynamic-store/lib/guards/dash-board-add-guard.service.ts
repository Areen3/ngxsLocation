import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashBoardAddGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log('dash route: ', this.router.url);
    return of(true);
  }
}
