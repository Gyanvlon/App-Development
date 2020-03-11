import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/index';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as _ from 'lodash';
import {
  AddGlobalFilterAction,
  GlobalFilterActionTypes,
  GlobalFilterUpdateAction,
  UpdateGlobalFilterAction
} from '../actions/global-filter.actions';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { PeriodService } from '../../shared/modules/period-filter/period.service';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { getCurrentUser } from '../selectors/current-user.selectors';
import { GlobalFilterChangeAction } from '../actions/visualization.actions';
import { OrgUnitService } from '../../shared/modules/org-unit-filter/org-unit.service';
import { Go, LoadPopulationDataAction } from '../actions';

@Injectable()
export class GlobalFilterEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private periodService: PeriodService,
    private orgUnitService: OrgUnitService
  ) {}

  @Effect({ dispatch: false })
  routerNavigation$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    withLatestFrom(this.store),
    tap(([action, state]: [any, AppState]) => {
      this.store
        .select(getCurrentUser)
        .pipe(filter((userInfo: any) => userInfo))
        .subscribe(currentUser => {
          const splitedUrl = action.payload.routerState.url.split('/');
          const queryParams = action.payload.routerState.queryParams;
          const currentPage = splitedUrl[1];

          const globalFilter = state.globalFilter.entities[currentPage];
          if (!globalFilter) {
            const userOrgUnitId =
              queryParams && queryParams.ou
                ? queryParams.ou
                : currentUser.organisationUnits[0].id;
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            const periodId =
              queryParams && queryParams.pe
                ? queryParams.pe
                : currentYear.toString() +
                  (currentMonth < 10
                    ? '0' + currentMonth.toString()
                    : currentMonth);

            const periodName = _.find(
              this.periodService.getPeriodsBasedOnType('Monthly', currentYear),
              ['id', periodId]
            )
              ? _.find(
                  this.periodService.getPeriodsBasedOnType(
                    'Monthly',
                    currentYear
                  ),
                  ['id', periodId]
                ).name
              : _.find(
                  this.periodService.getPeriodsBasedOnType(
                    'Monthly',
                    currentYear - 1
                  ),
                  ['id', periodId]
                ).name;

            if (
              (currentPage === 'data-entry' || currentPage === 'download') &&
              splitedUrl[3] &&
              userOrgUnitId !== splitedUrl[3]
            ) {
              this.orgUnitService
                .getOrgunitById(splitedUrl[3])
                .subscribe((orgUnit: any) => {
                  this.store.dispatch(
                    new LoadPopulationDataAction(
                      currentUser.organisationUnits[0].id,
                      periodId
                    )
                  );
                  this.store.dispatch(
                    new AddGlobalFilterAction({
                      id: 'data-entry',
                      pe: {
                        name: periodName,
                        id: periodId,
                        type: 'Monthly',
                        year: currentYear
                      },
                      ou: { name: orgUnit.name, id: orgUnit.id },
                      visitedPages: []
                    })
                  );
                });
            } else if (currentPage === 'dashboards') {
              this.orgUnitService
                .getOrgunitLevelsInformation()
                .subscribe((orgUnitLevelResponse: any) => {
                  this.orgUnitService
                    .getOrgunitById(userOrgUnitId)
                    .subscribe((orgUnit: any) => {
                      const userOrgUnit =
                        orgUnit || currentUser.organisationUnits[0];
                      const orgUnitChildLevel = _.find(
                        orgUnitLevelResponse.organisationUnitLevels,
                        ['level', userOrgUnit.level + 1]
                      );
                      const orgUnitName = orgUnitChildLevel
                        ? orgUnitChildLevel.name + ' in ' + userOrgUnit.name
                        : userOrgUnit.name;
                      const orgUnitId = orgUnitChildLevel
                        ? userOrgUnit.id +
                          ';LEVEL-' +
                          userOrgUnit.level +
                          ';LEVEL-' +
                          orgUnitChildLevel.level
                        : userOrgUnit.id;

                      // Also update query parameters
                      this.store.dispatch(
                        new Go({
                          path: [state.route.state.url.split('?')[0]],
                          query: {
                            ou: _.filter(
                              orgUnitId.split(';') || [],
                              (value: any) =>
                                value.indexOf('LEVEL-') === -1 &&
                                value.indexOf('GROUP') === -1
                            )[0],
                            pe: periodId
                          }
                        })
                      );

                      this.store.dispatch(
                        new AddGlobalFilterAction({
                          id: currentPage,
                          pe: {
                            name: periodName,
                            id: periodId,
                            type: 'Monthly',
                            year: currentYear
                          },
                          ou: { name: orgUnitName, id: orgUnitId },
                          visitedPages: _.filter(
                            [splitedUrl[2]],
                            (pageId: string) =>
                              pageId.split('?')[0] !== undefined
                          )
                        })
                      );
                    });
                });
            } else {
              this.store.dispatch(
                new LoadPopulationDataAction(
                  currentUser.organisationUnits[0].id,
                  periodId
                )
              );
              this.store.dispatch(
                new AddGlobalFilterAction({
                  id: 'data-entry',
                  pe: {
                    name: periodName,
                    id: periodId,
                    type: 'Monthly',
                    year: currentYear
                  },
                  ou: {
                    name: currentUser.organisationUnits[0].name,
                    id: currentUser.organisationUnits[0].id
                  },
                  visitedPages: []
                })
              );
            }
          }
        });
    })
  );

  @Effect()
  globalFilterUpdate$ = this.actions$.pipe(
    ofType(GlobalFilterActionTypes.GLOBAL_FILTER_UPDATE),
    withLatestFrom(this.store),
    map(([action, state]: [GlobalFilterUpdateAction, AppState]) => {
      const currentGlobalFilter =
        state.globalFilter && state.globalFilter.entities
          ? state.globalFilter.entities[action.currentPage]
          : null;

      if (currentGlobalFilter) {
        const routeFilters = {
          ...{
            ou: currentGlobalFilter.ou
              ? _.filter(
                  currentGlobalFilter.ou.id.split(';') || [],
                  (value: any) =>
                    value.indexOf('LEVEL-') === -1 &&
                    value.indexOf('GROUP') === -1
                )[0]
              : undefined,
            pe: currentGlobalFilter.pe ? currentGlobalFilter.pe.id : undefined
          },
          ...{
            [action.globalFilter.name]: _.filter(
              action.globalFilter.value.split(';') || [],
              (value: any) =>
                value.indexOf('LEVEL-') === -1 && value.indexOf('GROUP') === -1
            )[0]
          }
        };

        this.store.dispatch(
          new Go({
            path: [state.route.state.url.split('?')[0]],
            query: routeFilters
          })
        );
      }
      this.store.dispatch(
        new GlobalFilterChangeAction({
          currentDashboardId: state.dashboard.currentDashboard,
          filterValue: action.globalFilter
        })
      );

      const splitedUrl = state.route.state.url.split('/');

      return new UpdateGlobalFilterAction(
        splitedUrl[1] === 'download' ? 'data-entry' : splitedUrl[1],
        {
          [action.globalFilter.name]: action.globalFilter
            ? action.globalFilter.globalItem
              ? action.globalFilter.globalItem
              : action.globalFilter.items
              ? action.globalFilter.items[0]
              : null
            : null,
          visitedPages: _.filter(
            [splitedUrl[2]],
            (pageId: string) => pageId.split('?')[0] !== undefined
          )
        }
      );
    })
  );
}
