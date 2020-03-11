import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as dashboardActions from '../../../../store/actions/dashboard.actions';
import { Store } from '@ngrx/store';
import { DashboardMenuItem } from '../../../../core/models/dashboard-menu-item.model';
import { AppState } from '../../../../store/reducers/index';

@Component({
  selector: 'app-dashboard-menu-edit',
  templateUrl: './dashboard-menu-edit.component.html',
  styleUrls: ['./dashboard-menu-edit.component.css']
})
export class DashboardMenuEditComponent implements OnInit {

  @Input() dashboardMenuItem: DashboardMenuItem;
  @Output() onEditFormClose: EventEmitter<any> = new EventEmitter<any>();

  dashboardName: string;

  constructor(private store: Store<AppState>) {
  }

  get inputSize() {
    return this.dashboardName ? this.dashboardName.length > 12 ? this.dashboardName.length : 12 : 12;
  }

  get dashboardNameIsWhiteSpace() {
    return this.dashboardName ? this.dashboardName.trim().length > 1 ? false : true : true;
  }

  ngOnInit() {
    if (this.dashboardMenuItem) {
      this.dashboardName = this.dashboardMenuItem.name;
    }
  }

  closeEditForm(e) {
    e.stopPropagation();
    this.onEditFormClose.emit(true);
  }

  save(e) {
    e.stopPropagation();
    this.store.dispatch(new dashboardActions.RenameAction({id: this.dashboardMenuItem.id, name: this.dashboardName}));
    this.onEditFormClose.emit(true);
  }

}
