import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as dashboardSelectors from '../../../../store/selectors/dashboard.selectors';
import { Dashboard } from '../../../../core/models/dashboard.model';
import { AppState } from '../../../../store/reducers/index';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit {

  currentDashboard$: Observable<Dashboard>;
  constructor(private store: Store<AppState>) {
    this.currentDashboard$ = this.store.select(dashboardSelectors.getCurrentDashboard);
  }

  ngOnInit() {
  }

}
