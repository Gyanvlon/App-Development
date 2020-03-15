import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
// import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class NavbarAuthServiceService {
  loggedIn = new BehaviorSubject<boolean>(true);


  constructor() { }

  initiatelogin() {
    // if (user.userName !== '' && user.password !== '') { // {3}
    this.loggedIn.next(true);
    // this.router.navigate(['/']);
  }


  destroylogout() {
    this.loggedIn.next(false);
    // this.router.navigate(['/login']);
  }
}
