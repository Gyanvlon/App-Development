import { Action } from '@ngrx/store';
import { OrganisationUnitModel } from '../../core/models/statict-data-entry.model';

export enum OrganisationUnitActions {
  LOAD = '[Current Organisation unit] Loading selected organisation unit',
  SUCCESS_TO_LOAD = '[Current Organisation unit] Success to load selected organisation unit',
  UPDATE_MESSAGE_OBJECT_ON_ORGANISATION_UNIT = '[Current Organisation unit] Update fail action on organisation unit',
  RESET_MESSAGE_OBJECT_ON_ORGANISATION_UNIT = '[Current Organisation unit] Reset fail action on organisation unit',
  LOAD_POPULATION_DATA = '[Current Organisation unit] Load population data for selected organisation units',
  LOAD_POPULATION_DATA_SUCCESS = '[Current Organisation unit] Load population data for selected organisation units success'
}

export class LoadingOrganisationUnitAction implements Action {
  readonly type = OrganisationUnitActions.LOAD;
  constructor(public payload: string) {}
}

export class SuccessToOrganisationUnitAction implements Action {
  readonly type = OrganisationUnitActions.SUCCESS_TO_LOAD;
  constructor(public payload: OrganisationUnitModel) {}
}

export class UpdateMessageObjectOnOrganisationUnitAction implements Action {
  readonly type =
    OrganisationUnitActions.UPDATE_MESSAGE_OBJECT_ON_ORGANISATION_UNIT;
  constructor(public error: { type: string; message: any }) {}
}

export class ResetMessageObjectOnOrganisationUnitAction implements Action {
  readonly type =
    OrganisationUnitActions.RESET_MESSAGE_OBJECT_ON_ORGANISATION_UNIT;
}

export class LoadPopulationDataAction implements Action {
  readonly type = OrganisationUnitActions.LOAD_POPULATION_DATA;
  constructor(public orgUnit: string, public period: string) {}
}

export class LoadPopulationDataSuccessAction implements Action {
  readonly type = OrganisationUnitActions.LOAD_POPULATION_DATA_SUCCESS;
  constructor(public populationData: { orgUnit: string; population: number }) {}
}

export type OrganisationUnitActionsTypes =
  | LoadingOrganisationUnitAction
  | SuccessToOrganisationUnitAction
  | UpdateMessageObjectOnOrganisationUnitAction
  | ResetMessageObjectOnOrganisationUnitAction
  | LoadPopulationDataAction
  | LoadPopulationDataSuccessAction;
