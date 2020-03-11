import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import {
  getEventsLoading,
  getEventsIsSubmitting,
  getEventsError,
  getEventsMessageObject,
  getIsfromNewDistributionPoint,
  getEventsLoaded,
  getEventsEntities,
  getEventCompletedNotification
} from '../reducers/event.reducer';
import { Event } from '../../core/models/event.model';

export const getEventState = createSelector(
  getRootState,
  (state: AppState) => state.events
);

export const getEventLoaded = createSelector(
  getEventState,
  getEventsLoaded
);
export const getEventLoading = createSelector(
  getEventState,
  getEventsLoading
);
export const getEventIsSubmitting = createSelector(
  getEventState,
  getEventsIsSubmitting
);
export const getIsEventError = createSelector(
  getEventState,
  getEventsError
);
export const getEventMessageObject = createSelector(
  getEventState,
  getEventsMessageObject
);
export const getIsEventfromNewDistributionPoint = createSelector(
  getEventState,
  getIsfromNewDistributionPoint
);

export const getEventEntities = createSelector(
  getEventState,
  getEventsEntities
);

export const getCurrentEvent = id =>
  createSelector(
    getEventEntities,
    entities => {
      return entities[id];
    }
  );

export const getCompletenessNotification = createSelector(
  getEventState,
  getEventCompletedNotification
);
