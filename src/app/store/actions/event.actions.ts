import { Action } from '@ngrx/store';
import { Event } from '../../core/models/event.model';

export enum EventActionTypes {
  LOAD = '[Event] Load event',
  LOAD_SUCCESS = '[Event] Load Event success',
  LOAD_FAIL = '[Event] Load Event fail',
  UPDATE_EVENT_ATTRIBUTES = '[Event] Update DataElement value event',
  UPDATE_EVENT = '[Event] Update Event',
  CREATE_EVENT = '[Event] Create Event',
  CREATE_EVENT_SUCCESS = '[Event] Create Event Success',
  UPDATE_EVENT_SUCCESS = '[Event] Update Event Success',
  UPDATE_EVENT_ATTRIBUTES_SUCCESS = '[Event] Update Event DataElement Success',
  UPDATE_EVENT_FAIL = '[Event] Update Event Fail',
  NOTIFICATION_ON_COMPLETE = '[Event] Notifify event if complete'
}

export class LoadEventAction implements Action {
  readonly type = EventActionTypes.LOAD;
  constructor(
    public payload: {
      programId: string;
      orgUnitId: string;
      startDate: string;
      endDate: string;
      period?: string;
    },
    public isSubmitting: boolean = false
  ) {}
}

export class LoadEventSuccessAction implements Action {
  readonly type = EventActionTypes.LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateEventDataElementSuccessAction implements Action {
  readonly type = EventActionTypes.UPDATE_EVENT_ATTRIBUTES_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateEventDataElementAction implements Action {
  readonly type = EventActionTypes.UPDATE_EVENT_ATTRIBUTES;
  constructor(public payload: any) {}
}

export class UpdateEventSuccessAction implements Action {
  readonly type = EventActionTypes.UPDATE_EVENT_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateEventAction implements Action {
  readonly type = EventActionTypes.UPDATE_EVENT;
  constructor(public payload: any, public isSubmitting: boolean = false) {}
}

export class CreateEventAction implements Action {
  readonly type = EventActionTypes.UPDATE_EVENT;
  constructor(public payload: any, public isSubmitting: boolean = false) {}
}

export class CreateEventSuccessAction implements Action {
  readonly type = EventActionTypes.UPDATE_EVENT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadEventFailAction implements Action {
  readonly type = EventActionTypes.LOAD_FAIL;
  constructor(public error: any) {}
}

export class NotifyEventCompleteAction implements Action {
  readonly type = EventActionTypes.NOTIFICATION_ON_COMPLETE;
  constructor(public payload: any) {}
}

export class UpdateEventFailAction implements Action {
  readonly type = EventActionTypes.UPDATE_EVENT_FAIL;
  constructor(public error: any) {}
}

export type EventAction =
  | LoadEventAction
  | LoadEventSuccessAction
  | LoadEventFailAction
  | UpdateEventDataElementSuccessAction
  | UpdateEventFailAction
  | CreateEventSuccessAction
  | CreateEventAction
  | UpdateEventAction
  | UpdateEventDataElementAction
  | NotifyEventCompleteAction;
