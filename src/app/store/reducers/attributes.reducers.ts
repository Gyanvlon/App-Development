import { AttributeModel } from '../../core/models/statict-data-entry.model';
import {
  AttributesActionsTypes,
  AttributesActions
} from '../actions/attributes.actions';
import * as _ from 'lodash';

export interface AttributeState {
  entities: { [id: string]: AttributeModel };
  loaded: boolean;
  loading: boolean;
  error: string;
}

export const initialState: AttributeState = {
  entities: {},
  loaded: false,
  loading: false,
  error: ''
};

export function reducer(
  state: AttributeState = initialState,
  action: AttributesActionsTypes
): AttributeState {
  switch (action.type) {
    case AttributesActions.LOAD:
      return {
        ...state,
        loading: true
      };
    case AttributesActions.SUCCESS_TO_LOAD:
      const newEntities = _.keyBy(action.payload, 'id');
      const entities = { ...state.entities, ...newEntities };
      return {
        ...state,
        entities,
        loaded: true,
        loading: false
      };
    case AttributesActions.FAILED_TO_LOAD:
      const { error } = action;
      return {
        ...state,
        entities,
        loaded: true,
        loading: false
      };
  }

  return state;
}
export const getAttributesEntities = (state: AttributeState) => state.entities;
export const getAttributesLoading = (state: AttributeState) => state.loading;
export const getAttributesLoaded = (state: AttributeState) => state.loaded;