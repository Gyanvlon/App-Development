import { Action } from '@ngrx/store';
import { CurrentUser } from '../../core/models/current-user.model';

export enum CurrentUserActionTypes {
  LOAD = '[Current User] Load current user',
  LOAD_SUCCESS = '[Current User] Load current user success',
  LOAD_FAIL = '[Current User] Load current user fail'
}

export class LoadCurrentUserAction implements Action {
  readonly type = CurrentUserActionTypes.LOAD;
}

export class LoadCurrentUserSuccessAction implements Action {
  readonly type = CurrentUserActionTypes.LOAD_SUCCESS;

  constructor(public currentUser: CurrentUser) {}
}

export class LoadCurrentUserFailAction implements Action {
  readonly type = CurrentUserActionTypes.LOAD_FAIL;
}

export type CurrentUserAction = LoadCurrentUserAction
  | LoadCurrentUserSuccessAction
  | LoadCurrentUserFailAction;
