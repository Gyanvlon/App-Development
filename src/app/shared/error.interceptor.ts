import { DataService } from './../services/data.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dataService: DataService, private router: Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                //  this.dataService.logout();
                // location.reload(true);
                // tslint:disable-next-line: align
            } if (err.status === 405) {
                // console.log('405');
                localStorage.removeItem('currentUser');
                this.router.navigate(['/login']);
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
