import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { OrganisationUnitModel } from '../../core/models/statict-data-entry.model';
import { OrganisationUnitService } from '../../core/services/organisation-unit.service';
import { GlobalFilterActionTypes } from '../actions/global-filter.actions';
import {
  LoadingOrganisationUnitAction,
  LoadPopulationDataAction,
  LoadPopulationDataSuccessAction,
  OrganisationUnitActions,
  SuccessToOrganisationUnitAction,
  UpdateMessageObjectOnOrganisationUnitAction
} from '../actions/organisation-unit.action';
import { AppState } from '../reducers';
import { getCurrentPageState } from '../selectors/router.selectors';
import { getCurrentGlobalFilter } from '../selectors/global-filter.selectors';

@Injectable()
export class OrganisationUnitEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private organisationUnitService: OrganisationUnitService
  ) {}

  @Effect()
  loadingOrganisationUnit$ = this.actions$.pipe(
    ofType(OrganisationUnitActions.LOAD),
    map((action: LoadingOrganisationUnitAction) => action.payload),
    switchMap(organisationUnitId => {
      return this.organisationUnitService
        .loadingOrganisationUnit(organisationUnitId)
        .pipe(
          map(
            (organisation: OrganisationUnitModel) =>
              new SuccessToOrganisationUnitAction(organisation)
          ),
          catchError(error =>
            of(
              new UpdateMessageObjectOnOrganisationUnitAction({
                type: 'danger',
                message: error
              })
            )
          )
        );
    })
  );

  @Effect({ dispatch: false })
  globalFilterUpdate$: Observable<any> = this.actions$.pipe(
    ofType(GlobalFilterActionTypes.GLOBAL_FILTER_UPDATE),
    withLatestFrom(
      this.store.select(getCurrentGlobalFilter),
      this.store.select(getCurrentPageState)
    ),
    tap(([action, currentFilter, currentPage]: [any, any, string]) => {
      if (action.globalFilter && currentPage === 'data-entry') {
        const orgUnit =
          action.globalFilter && action.globalFilter.name === 'ou'
            ? action.globalFilter.value
            : currentFilter && currentFilter.ou && currentFilter.ou.id
            ? currentFilter.ou.id
            : '';

        const period =
          action.globalFilter && action.globalFilter.name === 'pe'
            ? action.globalFilter.value
            : currentFilter && currentFilter.pe && currentFilter.pe.id
            ? currentFilter.pe.id
            : '';

        this.store.dispatch(new LoadPopulationDataAction(orgUnit, period));
      }
    })
  );

  @Effect({ dispatch: false })
  loadPopulationData$: Observable<any> = this.actions$.pipe(
    ofType(OrganisationUnitActions.LOAD_POPULATION_DATA),
    tap((action: any) => {
      this.organisationUnitService
        .loadOrganisationUnitPopulationData(action.orgUnit, action.period)
        .subscribe(population => {
          this.store.dispatch(
            new LoadPopulationDataSuccessAction({
              orgUnit: action.orgUnit,
              population
            })
          );
        });
    })
  );
}
