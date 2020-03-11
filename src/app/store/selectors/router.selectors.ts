import { createSelector } from '@ngrx/store';
import { getRouterState } from '../reducers/index';
export const getRouter = createSelector(getRouterState, state => state);
export const getCurrentPageState = createSelector(
  getRouter,
  routeState =>
    routeState && routeState.state && routeState.state.url
      ? routeState.state.url.split('/')[1]
      : ''
);
export const getRouterParams = createSelector(
  getRouter,
  (routeState: any) =>
    routeState && routeState.state ? routeState.state.queryParams : null
);
