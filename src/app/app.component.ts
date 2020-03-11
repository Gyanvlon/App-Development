import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers';
import { LoadCurrentUserAction } from './store/actions/current-user.actions';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { GlobalFilter } from './core/models/global-filter.model';
import {
  getCurrentGlobalFilter,
  getCurrentOrgUnitFilter
} from './store/selectors/global-filter.selectors';
import {
  GlobalFilterUpdateAction,
  UpdateVisitedPageAction
} from './store/actions/global-filter.actions';
import { getVisualizationObjectsLoadingProgress } from './store/selectors/visualization.selectors';
import { filter, switchMap, take } from 'rxjs/operators';
import { getCurrentDashboard } from './store/selectors/dashboard.selectors';
import { Dashboard } from './core/models/dashboard.model';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { getCurrentPageState } from './store/selectors/router.selectors';
import { Go } from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
        animate(300),
        style({
          opacity: 0
        })
      ])
    ])
  ]
})
export class AppComponent {
  title: string;
  pages: any[];
  showOrgUnitFilter: boolean;
  showPeriodFilter: boolean;
  showMobileMenu: boolean;
  globalFilter$: Observable<GlobalFilter>;
  orgUnitFilter$: Observable<any>;
  currentPage$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.showMobileMenu = false;
    store.dispatch(new LoadCurrentUserAction());
    this.globalFilter$ = store.select(getCurrentGlobalFilter);
    this.orgUnitFilter$ = store.select(getCurrentOrgUnitFilter);
    this.currentPage$ = store.select(getCurrentPageState);
    store
      .select(getVisualizationObjectsLoadingProgress)
      .pipe(
        filter(
          (progressResult: any) => parseInt(progressResult.progress, 10) === 100
        ),
        switchMap(() => store.select(getCurrentDashboard))
      )
      .subscribe((currentDashboard: Dashboard) => {
        store.dispatch(
          new UpdateVisitedPageAction('dashboards', currentDashboard.id)
        );
      });
    this.title = 'Distribution Point Data Manager';
    this.pages = [
      {
        name: 'Home',
        link: 'dashboards/home',
        icon: 'home',
        tooltip: 'Home'
      },
      {
        name: 'Data entry',
        link: 'data-entry',
        icon: 'pencil-square-o',
        tooltip: 'Data management'
      },
      {
        name: 'Download',
        link: 'download',
        icon: 'pencil-square-o',
        tooltip: 'Download'
      },
      {
        name: 'Analysis',
        link: 'dashboards/analysis',
        icon: 'bar-chart',
        tooltip: 'Analysis'
      },
      {
        name: 'Reports',
        link: 'dashboards/reports',
        icon: 'file',
        tooltip: 'Reports'
      },
      {
        name: 'Map',
        link: 'dashboards/maps',
        icon: 'map',
        tooltip: 'Map'
      }
    ];
    this.showOrgUnitFilter = this.showPeriodFilter = false;
  }

  toggleOrgUnitFilter(e) {
    e.stopPropagation();
    this.showOrgUnitFilter = !this.showOrgUnitFilter;
  }

  togglePeriodFilter(e) {
    e.stopPropagation();
    this.showPeriodFilter = !this.showPeriodFilter;
  }

  updateOrgUnit(orgUnitModel) {
    this.showOrgUnitFilter = false;
    this.currentPage$.pipe(take(1)).subscribe(currentPage => {
      if (orgUnitModel.items && orgUnitModel.items.length > 0) {
        const nonOrgUnitItems = orgUnitModel.items.filter(
          (item: any) =>
            item.id.indexOf('LEVEL') !== -1 ||
            item.id.indexOf('OU_GROUP') !== -1
        );
        const orgUnitItems = orgUnitModel.items.filter(
          (item: any) =>
            item.id.indexOf('LEVEL') === -1 &&
            item.id.indexOf('OU_GROUP') === -1
        );

        if (orgUnitItems.length > 0) {
          orgUnitModel.globalItem =
            currentPage === 'dashboards'
              ? {
                  id:
                    nonOrgUnitItems.length > 0
                      ? orgUnitItems[0].id +
                        ';LEVEL-' +
                        orgUnitItems[0].level +
                        ';' +
                        nonOrgUnitItems.map(item => item.id).join(';')
                      : orgUnitItems[0].id,
                  name:
                    nonOrgUnitItems.length > 0
                      ? nonOrgUnitItems.map(item => item.name).join(', ') +
                        ' in ' +
                        orgUnitItems[0].name
                      : orgUnitItems[0].name
                }
              : {
                  id:
                    nonOrgUnitItems.length > 0
                      ? orgUnitItems[0].id +
                        ';' +
                        nonOrgUnitItems.map(item => item.id).join(';')
                      : orgUnitItems[0].id,
                  name:
                    nonOrgUnitItems.length > 0
                      ? nonOrgUnitItems.map(item => item.name).join(', ') +
                        ' in ' +
                        orgUnitItems[0].name
                      : orgUnitItems[0].name
                };
        }

        this.store.dispatch(
          new GlobalFilterUpdateAction(
            {
              ...orgUnitModel,
              items: _.map(orgUnitModel.items, item => {
                return { ...item, id: `${item.id};LEVEL-${item.level}` };
              })
            },
            currentPage
          )
        );
      }
    });
  }

  updatePeriod(periodModel) {
    this.showPeriodFilter = false;

    this.currentPage$.pipe(take(1)).subscribe(currentPage => {
      if (periodModel.items && periodModel.items[0]) {
        this.store.dispatch(
          new GlobalFilterUpdateAction(periodModel, currentPage)
        );
      }
    });
  }

  toggleMobileMenu(e) {
    e.stopPropagation();
    this.showMobileMenu = !this.showMobileMenu;
  }
}
