import { Program } from '../../core/models/program.model';
import { ProgramAction, ProgramActionTypes } from '../actions/program.action';

export interface ProgramState {
  entities: { [id: number]: Program };
  loaded: boolean;
  loading: boolean;
  error: any;
}

export const initialState: ProgramState = {
  entities: {},
  loaded: false,
  loading: false,
  error: {}
};

export function reducer(state: ProgramState = initialState, action: ProgramAction): ProgramState {
  switch (action.type) {
    case ProgramActionTypes.LOAD:
      return {
        ...state,
        loading: true
      };
    case ProgramActionTypes.LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false
      };

    case ProgramActionTypes.LOAD_ALL_SUCCESS:
      const programs = action.programs;
      const pr_entities = programs.reduce(
        (_entities: { [id: number]: Program }, progam: Program) => {
          return {
            ..._entities,
            [progam.id]: progam
          };
        },
        {
          ...state.entities
        }
      );
      return {
        ...state,
        entities: pr_entities,
        loaded: true,
        loading: false
      };

    case ProgramActionTypes.LOAD_SUCCESS:
      const program = action.program;
      const entity = { [program.id]: program };
      const entities = { ...state.entities, ...entity };
      return {
        ...state,
        entities,
        loaded: true,
        loading: false
      };
  }

  return state;
}
export const getProgramsEntities = (state: ProgramState) => state.entities;
export const getProgramsLoading = (state: ProgramState) => state.loading;
export const getProgramsLoaded = (state: ProgramState) => state.loaded;
