import { createSelector } from '@ngrx/store';
import { getCurrentUserState } from '../reducers';
import { getCurrentUserLoadedState, getCurrentUserLoadingState, getUserState } from '../reducers/current-user.reducer';

export const getCurrentUser = createSelector(
  getCurrentUserState,
  getUserState
);

export const getCurrentUserLoading = createSelector(
  getCurrentUserState,
  getCurrentUserLoadingState
);

export const getCurrentUserLoaded = createSelector(
  getCurrentUserState,
  getCurrentUserLoadedState
);
