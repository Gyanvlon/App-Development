import { NgFlashMessageService } from 'ng-flash-messages';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from './../../../Services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from 'src/app/shared/Validation/comfirmPassword';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public token: any;
  // updatePassword = { password: '', confirmPassword: '' };

  constructor( private authenticationService: AuthenticationService, private formBuilder: FormBuilder, 
    private router: Router, private ngFlashMessageService: NgFlashMessageService, private route: ActivatedRoute) {
      route.params.subscribe(val => {
        this.token = this.route.snapshot.paramMap.get('token');
        console.log(this.token);
      });
  
  }
  ngOnInit() {
   this.changePasswordForm = this.formBuilder.group({
    // password: ['', Validators.required],
    // confirmPassword: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
    }, {
    validator: MustMatch('password', 'confirmPassword')
      });
  
  }
  onSubmit() {
    // console.log(updatePassword);

    let updatePassword = {
      password: this.changePasswordForm.get('password').value,
      confirmPassword: this.changePasswordForm.get('confirmPassword').value
    }
  console.log(updatePassword);
  this.authenticationService.resetPassword(updatePassword).subscribe( res => {
    console.log(res);
    if (res.status === 200) {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Password reset Successfully'],
        timeout: 500
      });
      setTimeout( () => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  })
 }
 get password() {
  return this.changePasswordForm.get('password');
}
get confirmPassword() {
  return this.changePasswordForm.get('confirmPassword');
}
}
