import { DistributionPoint } from '../../core/models/distribution-point.model';
import {
  DistributionPointAction,
  DistributionPointActionTypes
} from '../actions/distribution-point.action';

export interface DistributionPointState {
  entities: { [id: number]: DistributionPoint };
  loaded: boolean;
  loading: boolean;
}

export const initialState: DistributionPointState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state: DistributionPointState = initialState,
  action: DistributionPointAction
): DistributionPointState {
  switch (action.type) {
    case DistributionPointActionTypes.DELETE:
      return {
        ...state,
        loading: true
      };
    case DistributionPointActionTypes.DELETE_SUCCESS:
      const id = action.payload;
      const entities = { ...state.entities };
      delete entities[id];
      return {
        ...state,
        entities,
        loaded: true,
        loading: false
      };
  }

  return state;
}
export const getDistributionPointEntities = (state: DistributionPointState) => state.entities;
export const getDistributionPointLoading = (state: DistributionPointState) => state.loading;
export const getDistributionPointLoaded = (state: DistributionPointState) => state.loaded;
