import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ProgramService } from '../../core/services/program.service';
import { CurrentUserActionTypes } from '../actions/current-user.actions';
import {
  ProgramActionTypes,
  LoadProgramFailAction,
  LoadProgramSuccessAction,
  LoadAllProgramSuccessAction
} from '../actions/program.action';
import { Program } from '../../core/models/program.model';

@Injectable()
export class ProgramEffects {
  constructor(private actions$: Actions, private programService: ProgramService) {}

  @Effect()
  loadCurrentUser$ = this.actions$.pipe(
    ofType(CurrentUserActionTypes.LOAD_SUCCESS),
    switchMap(() => this.programService.loadAll()),
    map(response => new LoadAllProgramSuccessAction(response['programs'])),
    catchError(error => of(new LoadProgramFailAction(error)))
  );
}
