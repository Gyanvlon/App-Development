import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

export const routes: Routes = [
  {path: '', redirectTo: '/dashboards/home', pathMatch: 'full'},
  {path: 'dashboards/:id', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule'},
  {path: 'data-entry', loadChildren: 'app/pages/data-entry/data-entry.module#DataEntryModule'},
  {path: 'download', loadChildren: 'app/pages/data-entry/data-entry.module#DataEntryModule'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class RoutingModule {
}
