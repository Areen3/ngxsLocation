import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppComponent } from '@integration/app.component';
import { AppModule } from '@integration/app.module';
import { TodosState } from '@integration/store/todos/todos.state';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    NgxsStoragePluginModule.forRoot({ key: [TodosState] })
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
