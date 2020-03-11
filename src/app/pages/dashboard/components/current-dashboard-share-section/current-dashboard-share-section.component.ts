import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DashboardSharing } from '../../../../core/models/dashboard-sharing.model';
import { AppState } from '../../../../store/reducers/index';
import { getCurrentDashboardSharing } from '../../../../store/selectors/dashboard.selectors';
import { SharingEntity } from '../../modules/sharing-filter/models/sharing-entity';
import { UpdateSharingDataAction } from '../../../../store/actions/dashboard.actions';

@Component({
  selector: 'app-current-dashboard-share-section',
  templateUrl: './current-dashboard-share-section.component.html',
  styleUrls: ['./current-dashboard-share-section.component.css'],
  animations: [
    trigger('open', [
      state(
        'in',
        style({
          opacity: 1
        })
      ),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate(700)
      ]),
      transition('* => void', [
        animate(400),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class CurrentDashboardShareSectionComponent implements OnInit {
  showShareBlock: boolean;
  currentDashboardSharing$: Observable<DashboardSharing>;
  constructor(private store: Store<AppState>) {
    this.showShareBlock = false;
    this.currentDashboardSharing$ = store.select(
     getCurrentDashboardSharing
    );
  }

  ngOnInit() {}

  toggleShareBlock(e?) {
    if (e) {
      e.stopPropagation();
    }

    this.showShareBlock = !this.showShareBlock;
  }

  onSharingUpdate(sharingEntity: SharingEntity) {
    this.store.dispatch(
      new UpdateSharingDataAction(sharingEntity)
    );
  }
}
