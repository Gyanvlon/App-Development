import { Action } from '@ngrx/store';
import { Program } from '../../core/models/program.model';

export enum ProgramActionTypes {
  LOAD = '[Program] Load Program',
  LOAD_ALL = '[Program] Load All Program',
  LOAD_SUCCESS = '[Program] Load Program success',
  LOAD_ALL_SUCCESS = '[Program] Load All Program success',
  LOAD_FAIL = '[Program] Load Program fail'
}

export class LoadProgramAction implements Action {
  readonly type = ProgramActionTypes.LOAD;
}

export class LoadAllProgramAction implements Action {
  readonly type = ProgramActionTypes.LOAD;
}

export class LoadProgramSuccessAction implements Action {
  readonly type = ProgramActionTypes.LOAD_SUCCESS;
  constructor(public program: Program) {}
}
export class LoadAllProgramSuccessAction implements Action {
  readonly type = ProgramActionTypes.LOAD_ALL_SUCCESS;
  constructor(public programs: Program[]) {}
}

export class LoadProgramFailAction implements Action {
  readonly type = ProgramActionTypes.LOAD_FAIL;
  constructor(public error: any) {}
}

export type ProgramAction =
  | LoadProgramAction
  | LoadAllProgramAction
  | LoadProgramSuccessAction
  | LoadProgramFailAction
  | LoadAllProgramSuccessAction;
