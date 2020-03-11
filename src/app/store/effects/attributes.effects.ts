import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AttributesService } from '../../core';
import {
  LoadingAttributesAction,
  SuccessToLoadAttributesAction,
  FailToLoadAttributesAction
} from '../actions/attributes.actions';
import { CurrentUserActionTypes } from '../actions/current-user.actions';

@Injectable()
export class AttributesEffects {
  constructor(
    private actions$: Actions,
    private attributesServices: AttributesService
  ) {}

  @Effect()
  loadingAttributes$ = this.actions$.pipe(
    ofType(CurrentUserActionTypes.LOAD_SUCCESS),
    switchMap(() => {
      return this.attributesServices.loadingAttributes().pipe(
        map((data: any) => new SuccessToLoadAttributesAction(data)),
        catchError(error => of(new FailToLoadAttributesAction(error)))
      );
    })
  );
}
