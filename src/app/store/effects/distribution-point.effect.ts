import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { DistributionPointService } from '../../core/services/distribution-point.service';
import {
  DistributionPointActionTypes,
  DeleteDistributionPointAction,
  DeleteDistributionPointFailAction,
  DeleteDistributionPointSuccessAction
} from '../actions/distribution-point.action';
import { Event } from '../../core/models/event.model';

@Injectable()
export class DistributionPointEffects {
  constructor(
    private actions$: Actions,
    private distributionPointService: DistributionPointService
  ) {}

  @Effect()
  deleteOrgUnitEvent$ = this.actions$.pipe(
    ofType(DistributionPointActionTypes.DELETE),
    map((action: DeleteDistributionPointAction) => action.dId),
    switchMap(distributionPointId => {
      return this.distributionPointService.delete(distributionPointId).pipe(
        map(
          distributionPoint =>
            new DeleteDistributionPointSuccessAction(distributionPointId)
        ),
        catchError(error => of(new DeleteDistributionPointFailAction(error)))
      );
    })
  );
}
