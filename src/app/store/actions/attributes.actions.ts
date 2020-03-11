import { Action } from '@ngrx/store';
import { AttributeModel } from '../../core/models/statict-data-entry.model';

export enum AttributesActions {
  LOAD = '[Attributes] Loading Atttibutes',
  SUCCESS_TO_LOAD = '[Attributes] Success to load Atttibutes',
  FAILED_TO_LOAD = '[Attributes] Failed to load Atttibutes'
}

export class LoadingAttributesAction implements Action {
  readonly type = AttributesActions.LOAD;
}

export class SuccessToLoadAttributesAction implements Action {
  readonly type = AttributesActions.SUCCESS_TO_LOAD;
  constructor(public payload: any) {}
}

export class FailToLoadAttributesAction implements Action {
  readonly type = AttributesActions.FAILED_TO_LOAD;
  constructor(public error: any) {}
}

export type AttributesActionsTypes =
  | LoadingAttributesAction
  | SuccessToLoadAttributesAction
  | FailToLoadAttributesAction;
