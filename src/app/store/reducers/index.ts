import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { currentUserReducer, CurrentUserState } from './current-user.reducer';
import * as fromEvents from './event.reducer';
import * as fromOrganisationUnit from './organisation-unit.reducer';
import * as fromAttributes from './attributes.reducers';
import * as fromDistributionPoints from './distribution-point.reducer';
import * as fromPrograms from './program.reducer';
import { dashboardReducer, DashboardState } from './dashboard.reducer';
import {
  visualizationReducer,
  VisualizationState
} from './visualization.reducer';
import * as fromGlobalFilter from './global-filter.reducer';

export interface AppState {
  route: RouterReducerState;
  currentUser: CurrentUserState;
  events: fromEvents.EventState;
  organisationUnits: fromOrganisationUnit.OrganisationUnitState;
  attributes: fromAttributes.AttributeState;
  distributionPoints: fromDistributionPoints.DistributionPointState;
  programs: fromPrograms.ProgramState;
  dashboard: DashboardState;
  visualization: VisualizationState;
  globalFilter: fromGlobalFilter.GlobalFilterState;
}

export const reducers: ActionReducerMap<AppState> = {
  route: routerReducer,
  currentUser: currentUserReducer,
  events: fromEvents.reducer,
  organisationUnits: fromOrganisationUnit.reducer,
  attributes: fromAttributes.reducer,
  distributionPoints: fromDistributionPoints.reducer,
  programs: fromPrograms.reducer,
  dashboard: dashboardReducer,
  visualization: visualizationReducer,
  globalFilter: fromGlobalFilter.globalFilterReducer
};

export const getRootState = (state: AppState) => state;

/**
 * Get current user state
 */
export const getCurrentUserState = createSelector(
  getRootState,
  (state: AppState) => state.currentUser
);

/**
 * Get dashboard state
 */

export const dashboardState = (state: AppState) => state.dashboard;

/**
 * Get visualization state
 * @param {AppState} state
 */
export const getVisualizationState = (state: AppState) => state.visualization;

/**
 * Get global filter state
 * @param {AppState} state
 */
export const getGlobalFilterState = (state: AppState) => state.globalFilter;

export const getGlobalFilterEntityState = createSelector(
  getGlobalFilterState,
  state => state
);

export const {
  selectEntities: getGlobalFilterEntities
} = fromGlobalFilter.adapter.getSelectors(getGlobalFilterEntityState);

/**
 * Get router state
 * @param {AppState} state
 */
export const getRouterState = (state: AppState) => state.route;

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];
