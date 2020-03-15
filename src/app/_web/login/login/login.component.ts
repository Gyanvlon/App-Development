import { AuthenticationService } from './../../../Services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgFlashMessageService } from 'ng-flash-messages';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {
  error = '';
  loginForm: FormGroup;
  user = { email: '', password: '' };
  formBuilder: any;
  // tslint:disable-next-line:no-inferrable-types
  public firstLogin: boolean = false;
  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private ngFlashMessageService: NgFlashMessageService) {
  }
  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if ( currentUser) {
      const token = currentUser.accessToken;
      if ( token ) {
        this.router.navigate(['/dashboard']);
      }
    }
    // document.querySelector('body').classList.add('color');
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  onSubmit() {
    console.log(this.user);
    this.authenticationService.login(this.user).subscribe(
      res => {
        // console.log('res',res);
        if (res.status === 200) {
          console.log('message', res);
          localStorage.setItem('currentUser', JSON.stringify(res.data));
         // this.authenticationService.checkPopUp( this.firstLogin);
          this.router.navigate(['/dashboard']);
        }
      },
      error => {
        // Displays the error message using flash message
        console.log(error);
        this.ngFlashMessageService.showFlashMessage({
          messages: [error],
          timeout: 2000,
          type: 'danger'
        });
      });
  }
}
