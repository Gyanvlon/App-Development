import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromDashboardActions from '../../../../store/actions/dashboard.actions';
import { Dashboard } from '../../../../core/models/dashboard.model';
import { AppState } from '../../../../store/reducers/index';

@Component({
  selector: 'app-current-dashboard-bookmark-button',
  templateUrl: './current-dashboard-bookmark-button.component.html',
  styleUrls: ['./current-dashboard-bookmark-button.component.css']
})
export class CurrentDashboardBookmarkButtonComponent implements OnInit {
  @Input() currentDashboard: Dashboard;
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  bookmarkDashboard(e) {
    e.stopPropagation();

    this.store.dispatch(
      new fromDashboardActions.BookmarkDashboardAction({
        dashboardId: this.currentDashboard.id,
        bookmarked: !this.currentDashboard.details.bookmarked
      })
    );
  }
}
