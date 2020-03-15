import { AuthenticationService } from './../Services/authentication.service';
import { DataService } from './../services/data.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const currentUser = this.authenticationService.currentUserValue;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log('here is token', currentUser);
        if (currentUser !== null && currentUser.accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
        }
        return next.handle(request);
    }
}
