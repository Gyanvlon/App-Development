import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { CurrentUserService } from '../../core/services/current-user.service';
import {
  CurrentUserActionTypes, LoadCurrentUserFailAction,
  LoadCurrentUserSuccessAction
} from '../actions/current-user.actions';
import { CurrentUser } from '../../core/models/current-user.model';

@Injectable()
export class CurrentUserEffects {
  constructor(private actions$: Actions,
    private currentUserService: CurrentUserService) {
  }

  @Effect()
  loadCurrentUser$ = this.actions$.pipe(
    ofType(CurrentUserActionTypes.LOAD),
    switchMap(() => this.currentUserService.loadUser()),
    map(
      (currentUser: CurrentUser) =>
        new LoadCurrentUserSuccessAction(currentUser)
    ),
    catchError(error => of(new LoadCurrentUserFailAction()))
  );
}
