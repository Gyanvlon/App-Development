import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import { DashboardMenuItem } from '../../../../core/models/dashboard-menu-item.model';
import { AppState } from '../../../../store/reducers';

@Component({
  selector: 'app-dashboard-menu-list-desktop',
  templateUrl: './dashboard-menu-list-desktop.component.html',
  styleUrls: ['./dashboard-menu-list-desktop.component.css']
})
export class DashboardMenuListDesktopComponent implements OnInit {

  @Input() slideCss = '';
  @Input() dashboardMenuItems: DashboardMenuItem[];
  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
  }

}
