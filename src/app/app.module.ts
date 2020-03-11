import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { RoutingModule } from './app.routes';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effects';
import {
  RouterStateSerializer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouteSerializer } from './core/utils/route-serializer.util';
import { CoreModule, coreModules } from './core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDhis2MenuModule } from '@hisptz/ngx-dhis2-menu';
import { sharedModules } from './shared';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RoutingModule,
    ...coreModules,
    ...sharedModules,
    BrowserAnimationsModule,
    NgxDhis2MenuModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production
    }),

    /**
     * Reducers
     */
    StoreModule.forRoot(reducers, { metaReducers }),

    /**
     * Effects
     */
    EffectsModule.forRoot(effects),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule,

    /**
     * Dev tool, enabled only in development mode
     */
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [{ provide: RouterStateSerializer, useClass: RouteSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule {}
