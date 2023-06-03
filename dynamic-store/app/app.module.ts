import { NgModule } from '@angular/core';
import { AppComponent } from '@integration/app.component';
import { NgxsModule } from '@ngxs/store';
import { BrowserModule } from '@angular/platform-browser';
import { LibModule } from '../lib/lib.module';
import { DashBoardState } from '../lib/logic/dash-board/dash-board.state';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment as env } from '../../integration/environments/environment';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    LibModule,
    NgxsLoggerPluginModule.forRoot({ logger: console, collapsed: true }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: env.production }),
    NgxsModule.forRoot([DashBoardState])
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
