import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { BrowserModule } from '@angular/platform-browser';
import { LibModule } from '../lib/lib.module';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment as env } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    NgxsModule.forRoot([]),
    LibModule,
    AppRoutingModule,
    NgxsLoggerPluginModule.forRoot({ logger: console, collapsed: false }),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: env.production })
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
