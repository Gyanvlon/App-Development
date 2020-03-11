import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { containers } from './containers';
import { sharedModules } from '../../shared';
import { SharingFilterModule } from './modules/sharing-filter/sharing-filter.module';
import { components } from './components';
import { modules } from './modules';
import { FormsModule } from '@angular/forms';
import { pipes } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    SharingFilterModule,
    ...sharedModules,
    ...modules
  ],
  declarations: [...containers, ...components, ...pipes]
})
export class DashboardModule { }
