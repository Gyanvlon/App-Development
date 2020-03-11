import { CurrentUser } from '../../core/models/current-user.model';
import { CurrentUserAction, CurrentUserActionTypes } from '../actions/current-user.actions';

export interface CurrentUserState {
  user: CurrentUser;
  loading: boolean;
  loaded: boolean;
}

export const initialState: CurrentUserState = {
  loading: false,
  loaded: false,
  user: null
};

export function currentUserReducer(
  state: CurrentUserState = initialState,
  action: CurrentUserAction
): CurrentUserState {
  switch (action.type) {
    case CurrentUserActionTypes.LOAD:
      return {
        ...state,
        loading: true
      };
    case CurrentUserActionTypes.LOAD_SUCCESS:
      return {
        ...state,
        user: action.currentUser,
        loaded: true,
        loading: false
      };
  }

  return state;
}

export const getUserState = (state: CurrentUserState) => state.user;
export const getCurrentUserLoadingState = (state: CurrentUserState) => state.loading;
export const getCurrentUserLoadedState = (state: CurrentUserState) => state.loaded;
