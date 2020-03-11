import { createSelector } from '@ngrx/store';
import { getRootState, AppState } from '../reducers';
import {
  getProgramsLoading,
  getProgramsLoaded,
  getProgramsEntities
} from '../reducers/program.reducer';
import { Program } from '../../core/models/program.model';

export const getProgramState = createSelector(getRootState, (state: AppState) => state.programs);

export const getProgramEntities = createSelector(getProgramState, getProgramsEntities);

export const getCurrentProgram = id => createSelector(getProgramEntities, entities => entities[id]);
