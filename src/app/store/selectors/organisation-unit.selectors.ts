import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import {
  getOrganisationUnitsEntities,
  getOrganisationUnitsLoaded,
  getOrganisationUnitsLoading,
  getOrganisationUnitsMessageObject,
  getOrganisationUnitsError,
  getPopulationDataState
} from '../reducers/organisation-unit.reducer';
import { Event } from '../../core/models/event.model';
import { getCurrentGlobalFilter } from './global-filter.selectors';

export const getOrganisatioUnitState = createSelector(
  getRootState,
  (state: AppState) => state.organisationUnits
);

export const getOrganisationUnitEntities = createSelector(
  getOrganisatioUnitState,
  getOrganisationUnitsEntities
);

export const getOrganisationUnitError = createSelector(
  getOrganisatioUnitState,
  getOrganisationUnitsError
);

export const getOrganisationUnitLoading = createSelector(
  getOrganisatioUnitState,
  getOrganisationUnitsLoading
);

export const getOrganisationUnitMessageObject = createSelector(
  getOrganisatioUnitState,
  getOrganisationUnitsMessageObject
);

export const getCurrentOrganisationUnit = id =>
  createSelector(
    getOrganisationUnitEntities,
    entities => entities[id]
  );

export const getPopulationData = createSelector(
  getOrganisatioUnitState,
  getPopulationDataState
);

export const getPopulationDataForCurrentOrgUnit = createSelector(
  getPopulationData,
  getCurrentGlobalFilter,
  (populationData, globalFilter) => {
    const orgUnit =
      globalFilter && globalFilter.ou ? globalFilter.ou.id : undefined;
    return populationData[orgUnit];
  }
);
