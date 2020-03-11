import { Action } from '@ngrx/store';
import { DistributionPoint } from '../../core/models/distribution-point.model';

export enum DistributionPointActionTypes {
  DELETE = '[Distribution Point] Delete Distribution Point',
  DELETE_SUCCESS = '[Distribution Point] Delete Distribution Point success',
  DELETE_FAIL = '[Distribution Point] Delete Distribution Point fail'
}

export class DeleteDistributionPointAction implements Action {
  readonly type = DistributionPointActionTypes.DELETE;
  constructor(public dId: string) {}
}

export class DeleteDistributionPointSuccessAction implements Action {
  readonly type = DistributionPointActionTypes.DELETE_SUCCESS;
  constructor(public payload: string) {}
}

export class DeleteDistributionPointFailAction implements Action {
  readonly type = DistributionPointActionTypes.DELETE_FAIL;
  constructor(public error: any) {}
}

export type DistributionPointAction =
  | DeleteDistributionPointAction
  | DeleteDistributionPointSuccessAction
  | DeleteDistributionPointFailAction;
