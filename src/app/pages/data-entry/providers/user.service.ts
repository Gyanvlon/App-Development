import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService, PROGRAM_ID } from '../../../core';
export { PROGRAM_ID } from '../../../core/utils/constants.util';

@Injectable()
export class UserService {
  userSubscriber;
  user;
  constructor(private http: HttpClientService) {
    this.userSubscriber = http.get(
      '26/me.json?fields=id,userCredentials[userRoles[id,name,authorities,programs[id,name]]],organisationUnits'
    );
  }

  getUser() {
    return this.userSubscriber;
  }
  getAuthorities() {
    return new Observable(observer => {
      if (this.user) {
        observer.next(this.populateAuthorities());
      } else {
        this.userSubscriber.subscribe((userData: any) => {
          this.user = userData;
          observer.next(this.populateAuthorities());
        });
      }
    });
  }

  getUserRoles() {
    return new Observable(observer => {
      if (this.user) {
        observer.next(this.populateUserRoles());
      } else {
        this.userSubscriber.subscribe((userData: any) => {
          this.user = userData;
          observer.next(this.populateUserRoles());
        });
      }
    });
  }

  getPrograms() {
    return new Observable(observer => {
      if (this.user) {
        observer.next(this.populateProgramNames());
      } else {
        this.userSubscriber.subscribe((userData: any) => {
          this.user = userData;

          observer.next(this.populateProgramNames());
        });
      }
    });
  }
  getProgramIds() {
    return new Observable(observer => {
      if (this.user) {
        observer.next(this.populateProgramIds());
      } else {
        this.userSubscriber.subscribe((userData: any) => {
          this.user = userData;

          observer.next(this.populateProgramIds());
        });
      }
    });
  }
  getRootOrganisationUnits() {
    return new Observable(observer => {
      if (this.user) {
        observer.next(this.user.organisationUnits);
      } else {
        this.userSubscriber.subscribe((userData: any) => {
          this.user = userData;

          observer.next(this.user.organisationUnits);
        });
      }
    });
  }

  populateUserRoles() {
    const userRolesData = [];
    const { userCredentials } = this.user;
    if (userCredentials && userCredentials.userRoles) {
      const { userRoles } = userCredentials;
      userRoles.map((userRole: any) => {
        userRolesData.push({ id: userRole.id, name: userRole.name });
      });
    }
    return userRolesData;
  }

  populateAuthorities() {
    let authorities = [];
    this.user.userCredentials.userRoles.map((userRole: any) => {
      authorities = authorities.concat(userRole.authorities);
    });
    return authorities;
  }
  populateProgramNames() {
    const programs = [];
    this.user.userCredentials.userRoles.map((userRole: any) => {
      userRole.programs.map((program: any) => {
        programs.push(program.name);
      });
    });
    return programs;
  }
  populateProgramIds() {
    return [PROGRAM_ID];
  }
}
