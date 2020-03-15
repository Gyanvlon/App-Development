import { NgFlashMessageService } from 'ng-flash-messages';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './../../../Services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
public stakeholderDetail: any;
// public email: any;
public recoverForm: FormGroup;
public question: any[] = [];
  constructor(private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute, 
              private ngFlashMessageService: NgFlashMessageService,
              private router: Router ) { }
  ngOnInit() {
   this.authenticationService.securityQuestion().subscribe( res => {
     this.question = res.data;
    });
   this.stakeholderDetail = this.authenticationService.currentUserDetail();
    // .email = this.stakeholderDetail.email;
   this.recoverForm = this.formBuilder.group({
      email: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }
  onSubmit() {
    const data = {
      email: this.recoverForm.get('email').value,
      // securityQuestion: this.recoverForm.get('securityQuestion').value,
      securityAnswer: this.recoverForm.get('answer').value,
    };
    // "email": "padgett@mailinator.com",
    // "securityAnswer": "RMD"
    console.log(data);
    this.authenticationService.forgotPassword(data).subscribe( res => {

      console.log(res);
      if ( res.status === 200) {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Email has been sent to your registered mail'],
          timeout: 500
        });
        setTimeout( () => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    });
  }
   get email() {
    return this.recoverForm.get('email');
  }
  get answer() {
    return this.recoverForm.get('answer');
  }
  get securityQuestion() {
    return this.recoverForm.get('securityQuestion');
  }
 }
