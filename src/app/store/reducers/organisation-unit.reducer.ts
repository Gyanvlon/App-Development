import { OrganisationUnitModel } from '../../core/models/statict-data-entry.model';
import {
  OrganisationUnitActions,
  OrganisationUnitActionsTypes
} from '../actions/organisation-unit.action';
import * as _ from 'lodash';

export interface OrganisationUnitState {
  entities: { [id: string]: OrganisationUnitModel };
  loaded: boolean;
  loading: boolean;
  error: boolean;
  messageObject: any;
  populationData: any;
}

export const initialState: OrganisationUnitState = {
  entities: {},
  error: false,
  messageObject: null,
  loaded: false,
  loading: false,
  populationData: {}
};

export function reducer(
  state: OrganisationUnitState = initialState,
  action: OrganisationUnitActionsTypes
): OrganisationUnitState {
  switch (action.type) {
    case OrganisationUnitActions.LOAD:
      return {
        ...state,
        loading: true
      };
    case OrganisationUnitActions.SUCCESS_TO_LOAD:
      const organisationUnit = action.payload;
      const entity = { [organisationUnit.id]: organisationUnit };
      const entities = { ...state.entities, ...entity };

      return {
        ...state,
        entities,
        messageObject: null,
        error: false,
        loaded: true,
        loading: false
      };
    case OrganisationUnitActions.UPDATE_MESSAGE_OBJECT_ON_ORGANISATION_UNIT:
      const messageObject = action.error;
      return {
        ...state,
        messageObject,
        error: true,
        loaded: false,
        loading: false
      };
    case OrganisationUnitActions.RESET_MESSAGE_OBJECT_ON_ORGANISATION_UNIT:
      return {
        ...state,
        messageObject: null,
        error: false,
        loaded: false,
        loading: false
      };
    case OrganisationUnitActions.LOAD_POPULATION_DATA_SUCCESS: {
      return {
        ...state,
        populationData: {
          ...state.populationData,
          [action.populationData.orgUnit]: action.populationData.population
        }
      };
    }
  }

  return state;
}
export const getOrganisationUnitsEntities = (state: OrganisationUnitState) =>
  state.entities;
export const getOrganisationUnitsLoading = (state: OrganisationUnitState) =>
  state.loading;
export const getOrganisationUnitsError = (state: OrganisationUnitState) =>
  state.error;
export const getOrganisationUnitsMessageObject = (
  state: OrganisationUnitState
) => state.messageObject;
export const getOrganisationUnitsLoaded = (state: OrganisationUnitState) =>
  state.loaded;
export const getPopulationDataState = (state: OrganisationUnitState) =>
  state.populationData;
