import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as systemInfoActions from '../actions/system-info.action';
import * as fromServices from '../../services';
import { tap } from 'rxjs/operators/tap';

@Injectable()
export class SystemInfoEffects {
  constructor(
    private actions$: Actions,
    private systemInfoService: fromServices.SystemService
  ) {}

  @Effect({ dispatch: false })
  addContextPath$ = this.actions$.pipe(
    ofType(systemInfoActions.ADD_CONTEXT_PATH),
    tap((action: systemInfoActions.AddContectPath) => {
      this.systemInfoService.getSystemInfo().subscribe(info => {
        localStorage.setItem('contextPath', info['contextPath']);
        localStorage.setItem('version', info['version']);
        localStorage.setItem(
          'spatialSupport',
          info['databaseInfo']['spatialSupport']
        );
      });
    })
  );
}
