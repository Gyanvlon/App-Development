import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { AppState, getRootState } from '../reducers';
import { getAttributesEntities } from '../reducers/attributes.reducers';

export const getAttributeState = createSelector(
  getRootState,
  (state: AppState) => state.attributes
);

export const getAllAttributesObject = createSelector(
  getAttributeState,
  getAttributesEntities
);

export const getAttributes = createSelector(
  getAllAttributesObject,
  attributeEntities =>
    _.map(Object.keys(attributeEntities) || [], key => {
      return { value: '', attribute: attributeEntities[key] };
    })
);

export const getAttributeEvent = id =>
  createSelector(
    getAllAttributesObject,
    entities => entities[id]
  );
