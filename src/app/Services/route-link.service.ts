import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteLinkService {
routeActive = new BehaviorSubject<boolean> (false);
setRouteStatus(routeActive: boolean) {
  this.routeActive.next(routeActive);
}
constructor(private http: HttpClient) { }

}
