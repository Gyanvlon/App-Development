import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import * as fromDashboardSelectors from '../../../../store/selectors/dashboard.selectors';
import * as fromDashboardActions from '../../../../store/actions/dashboard.actions';
import { DashboardMenuItem } from '../../../../core/models/dashboard-menu-item.model';
import { Dashboard } from '../../../../core/models/dashboard.model';
import { AppState } from '../../../../store/reducers/index';

@Component({
  selector: 'app-dashboard-menu-mobile',
  templateUrl: './dashboard-menu-mobile.component.html',
  styleUrls: ['./dashboard-menu-mobile.component.css']
})
export class DashboardMenuMobileComponent implements OnInit {

  showSelectionList: boolean;
  dashboardMenuList$: Observable<DashboardMenuItem[]>;
  currentDashboard$: Observable<Dashboard>;
  constructor(private store: Store<AppState>) {
    this.dashboardMenuList$ = store.select(fromDashboardSelectors.getAllDashboardMenuItems);
    this.currentDashboard$ = store.select(fromDashboardSelectors.getCurrentDashboard);
  }

  ngOnInit() {
  }

  toggleSelectionList(e) {
    e.stopPropagation();
    this.showSelectionList = !this.showSelectionList;
  }

  onSetCurrent(e, dashboardId: string) {
    e.stopPropagation();
    this.store.dispatch(new fromDashboardActions.SetCurrentAction(dashboardId));
    this.showSelectionList = false;
  }

}
