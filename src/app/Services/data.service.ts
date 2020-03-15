import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../shared/user';
// import { FlashMessageServiceService } from './flash-message-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  url = 'http://52.15.144.158:3000/api/v1/login';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  login(user): Observable<any> {
    console.log(user);
    return this.http.post(`${this.url}`, user);
  }

  // get projects from the server and display it in the dashboard
  // getProjects: Observable<any>{

  // url = 'http://52.15.144.158:3000/api/v1/projects/get-projects';
  // constructor(private http: HttpClient) {
  // }

  // getAll(): Observable<any> {
  //   // console.log(user);
  //   return this.http.get<any>(`${this.url}`);
  // }
}

