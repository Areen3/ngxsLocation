import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutingPathEnum } from '../lib/model/enums/routing-path-enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {
    this.store.dispatch(new Navigate([RoutingPathEnum.dashboard]));
  }

  ngOnInit(): void {}
}
