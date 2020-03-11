import { Component, OnInit } from '@angular/core';
import { Visualization } from '../../../../core/models/visualization.model';
import { Observable } from 'rxjs/Observable';
import { CurrentUser } from '../../../../core/models/current-user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/reducers/index';
import { getCurrentUser } from '../../../../store/selectors/current-user.selectors';
import {
  getCurrentDashboardVisualizationObjects,
  getVisualizationLoadingState
} from '../../../../store/selectors/visualization.selectors';
import { getCurrentDashboard } from '../../../../store/selectors/dashboard.selectors';
import { getRouterParams } from '../../../../store/selectors/router.selectors';
import { getCurrentGlobalFilter } from '../../../../store/selectors/global-filter.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  visualizationObjects$: Observable<Visualization[]>;
  currentUser$: Observable<CurrentUser>;
  visualizationLoading$: Observable<boolean>;
  currentDashboard$: Observable<any>;
  globalFilters$: Observable<any>;
  welcomingTitle: string;
  welcomingDescription: string;

  constructor(private store: Store<AppState>) {
    this.visualizationObjects$ = this.store.select(
      getCurrentDashboardVisualizationObjects
    );
    this.currentUser$ = this.store.select(getCurrentUser);
    this.visualizationLoading$ = this.store.select(
      getVisualizationLoadingState
    );
    this.currentDashboard$ = this.store.select(getCurrentDashboard);

    this.globalFilters$ = this.store.select(getCurrentGlobalFilter);

    this.welcomingTitle = 'Welcome to Distribution point dashboards';
    this.welcomingDescription = '';
  }

  ngOnInit() {}
}
