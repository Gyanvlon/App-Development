import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public stakeholderID: any;
  url = 'http://52.15.144.158:3000/api/v1/login';
  logoutUrl = 'http://52.15.144.158:3000/api/v1/logout';
  // logoutUrl = 'http://52.15.144.158:3000/api/v1/forget-password';
  secuirtyQuestionUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/get-questions';
  updateStakeholderUrl = 'http://52.15.144.158:3000/api/v1/stakeholders/edit-stakeholder';
  mainUrl= 'http://52.15.144.158:3000/api/v1/';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient, private router: Router) {
  }
  login(user): Observable<any> {
    console.log(user);
    localStorage.removeItem('currentUser');
    return this.http.post(`${this.url}`, user);
  }
  logOut(): Observable<any> {
    return this.http.get(`${this.logoutUrl}`);
  }
  securityQuestion(): Observable <any> {
    return this.http.get(`${this.secuirtyQuestionUrl}`);
  }
  checkPopUp() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.stakeholderID = currentUser.userId;
    console.log(currentUser.firstLogin, this.stakeholderID);
    return currentUser.firstLogin;
  }
  updateAnswer(data): Observable <any> {
    console.log(`${this.updateStakeholderUrl}/${this.stakeholderID}`);
    return this.http.put(`${this.updateStakeholderUrl}/${this.stakeholderID}`, data);
  }
  currentUserDetail()  {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
   //  console.log(currentUser);
    return currentUser;
  }
  updateProfile(imageFile, address, contactNo, questionId, answer): Observable<any> {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let id = user.userId;
    console.log(id);
    const data = new FormData();
    data.append('stakeholderImage', imageFile);
    data.append('address',  address);
    data.append('contactNo', contactNo);
    data.append('securityQuestion', questionId);
    data.append('securityAnswer', answer);
    return this.http.put(`${this.updateStakeholderUrl}/${id}`, data);
  }
  forgotPassword(data): Observable<any> {
    return this.http.post(`${this.mainUrl}forget-password`, data );
  }
  resetPassword(password): Observable <any> {
    console.log(password)
    return this.http.post(`${this.mainUrl}reset-password?token=`,password);
  }
}
