import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataEntryComponent } from './containers/data-entry/data-entry.component';
import { SubOrganisationUnitsComponent } from './containers/sub-organisation-units/sub-organisation-units.component';
import { HomeComponent } from './containers/home/home.component';
import { WaterPointComponent } from './containers/water-point/water-point.component';

let children = [
  { path: '', component: HomeComponent },
  {
    path: 'orgUnit/:id',
    component: SubOrganisationUnitsComponent
  },
  {
    path: 'orgUnit/:id/level/:level',
    component: SubOrganisationUnitsComponent
  },
  {
    path: 'orgUnit/:id/waterPoint/:waterPointId',
    component: SubOrganisationUnitsComponent
  },
  {
    path: 'orgUnit/:id/level/:level/waterPoint/:waterPointId',
    component: SubOrganisationUnitsComponent
  }
  // ,
  // {path: ':readonly', component: HomeComponent},
  // {
  //   path: ':readonly/orgUnit/:id',
  //   component: SubOrganisationUnitsComponent
  // },{
  //   path: ':readonly/orgUnit/:id/level/:level',
  //   component: SubOrganisationUnitsComponent
  // },
  // {
  //   path: ':readonly/orgUnit/:id/period/:pe',
  //   component: SubOrganisationUnitsComponent
  // },{
  //   path: ':readonly/orgUnit/:id/level/:level/period/:pe',
  //   component: SubOrganisationUnitsComponent,
  // }
];
const routes: Routes = [
  {
    path: '',
    component: DataEntryComponent,
    children: children
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEntryRoutingModule {}
