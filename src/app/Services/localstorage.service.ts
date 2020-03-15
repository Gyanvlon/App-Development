import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  isSuperAdmin;

  constructor() { }

  superadminLogin() {
    this.isSuperAdmin = localStorage.getItem('superadminLogin');
    console.log(this.isSuperAdmin);
    return this.isSuperAdmin;
  }
}
