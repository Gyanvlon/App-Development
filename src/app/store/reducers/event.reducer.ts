import { Event } from '../../core/models/event.model';
import { EventAction, EventActionTypes } from '../actions/event.actions';

export interface EventState {
  entities: { [id: number]: Event };
  loaded: boolean;
  error: boolean;
  messageObject: any;
  fromNewDistributionPoint: boolean;
  notification: any;
  loading: boolean;
  isSubmiting: boolean;
}

export const initialState: EventState = {
  entities: {},
  notification: null,
  error: false,
  messageObject: null,
  fromNewDistributionPoint: false,
  loaded: false,
  loading: false,
  isSubmiting: false
};

export function reducer(state: EventState = initialState, action: EventAction): EventState {
  switch (action.type) {
    case EventActionTypes.LOAD:
    case EventActionTypes.UPDATE_EVENT:
      const loading = state.loading ? state.loading : false;
      return {
        ...state,
        messageObject: null,
        loading,
        isSubmiting: action.isSubmitting
      };

    case EventActionTypes.UPDATE_EVENT_ATTRIBUTES:
      return {
        ...state,
        messageObject: null,
        fromNewDistributionPoint: true,
        loading: true,
        isSubmiting: false
      };
    case EventActionTypes.UPDATE_EVENT_ATTRIBUTES_SUCCESS:
      const { message: newM, entity: enty } = action.payload;
      const entities_ = { ...state.entities, ...enty };
      const messageObject_ = { message: newM, type: 'success' };
      return {
        ...state,
        loading: false,
        entities: entities_,
        messageObject: messageObject_,
        fromNewDistributionPoint: false,
        error: false,
        loaded: true,
        isSubmiting: false
      };

    case EventActionTypes.UPDATE_EVENT_SUCCESS:
      const { message, entity } = action.payload;
      const _entities = { ...state.entities, ...entity };
      const _messageObject = { message, type: 'success' };
      const _loading = state.fromNewDistributionPoint && state.loading ? state.loading : false;
      return {
        ...state,
        loading: false,
        entities: _entities,
        messageObject: _messageObject,
        error: false,
        loaded: true,
        isSubmiting: false
      };
    case EventActionTypes.LOAD_SUCCESS:
      const { eventEntity } = action.payload;
      const entities = { ...state.entities, ...eventEntity };
      const loading_ = state.fromNewDistributionPoint && state.loading ? state.loading : false;
      return {
        ...state,
        entities,
        loaded: true,
        messageObject: null,
        error: false,
        loading: loading_,
        isSubmiting: false
      };
    case EventActionTypes.UPDATE_EVENT_FAIL:
    case EventActionTypes.LOAD_FAIL:
      const messageObject = { message: JSON.parse(action.error), type: 'danger' };
      return {
        ...state,
        error: true,
        fromNewDistributionPoint: false,
        messageObject,
        isSubmiting: false
      };
    case EventActionTypes.NOTIFICATION_ON_COMPLETE:
      const notification = action.payload;
      return {
        ...state,
        messageObject: null,
        fromNewDistributionPoint: false,
        notification
      };
  }

  return state;
}
export const getEventsEntities = (state: EventState) => state.entities;
export const getEventsLoading = (state: EventState) => state.loading;
export const getEventsIsSubmitting = (state: EventState) => state.isSubmiting;
export const getEventsLoaded = (state: EventState) => state.loaded;
export const getEventsError = (state: EventState) => state.error;
export const getEventsMessageObject = (state: EventState) => state.messageObject;
export const getIsfromNewDistributionPoint = (state: EventState) => state.fromNewDistributionPoint;
export const getEventCompletedNotification = (state: EventState) => state.notification;
