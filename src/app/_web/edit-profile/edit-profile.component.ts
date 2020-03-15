import { MyValidators } from './../../shared/Validation/externalValidator';
import { AuthenticationService } from './../../Services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public editForm: FormGroup;
  public imageSrc: any = '/assets/img/prf-img.png';
  public file: File;
  public currentUserDetail: any;
  public question: any[] = [];
  public image: any;
  public stakeholderId: any;
  public stakeholderDetail: any;
  public Question: any;
  public QuestionId: any;

  constructor(private apiService: ApiService,
    private ngFlashMessageService: NgFlashMessageService,
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
    private router: Router) {
  }
  ngOnInit() {
    this.editForm = this.formBuilder.group({
      email: [''],
      address: ['', Validators.required],
      contactNo: ['', [Validators.required, MyValidators.NumberOnly,Validators.maxLength(15),Validators.minLength(10)]],
      securityQuestion: ['', Validators.required],
      answer: ['', Validators.required]
    });

    this.authenticationService.securityQuestion().subscribe(res => {
      this.question = res.data;
      console.log('role', this.question);
    });
    this.currentUserDetail = this.authenticationService.currentUserDetail();
    // this.image = this.currentUserDetail.stakeholderImage === null ? this.imageSrc : this.currentUserDetail.stakeholderImage;
    console.log(this.currentUserDetail.stakeholderImage);
    this.stakeholderId = this.currentUserDetail.userId;
    this.apiService.stakeholderProfile(this.stakeholderId).subscribe(res => {
      console.log("res", res);
      this.stakeholderDetail = res.data;
      let SecurityQuestion = this.stakeholderDetail.securityQuestion;
      this.Question = SecurityQuestion.question;
      this.QuestionId = SecurityQuestion._id;
      this.editForm.setValue({
        email: this.stakeholderDetail.email,
        address: this.stakeholderDetail.address,
        contactNo: this.stakeholderDetail.contactNo,
        answer: this.stakeholderDetail.securityAnswer,
        securityQuestion: this.QuestionId
      });
      console.log(this.Question);
      console.log(this.stakeholderDetail);
      this.image = this.stakeholderDetail.stakeholderImage === null ? this.imageSrc : this.stakeholderDetail.stakeholderImage;
      console.log(this.stakeholderDetail);
    });
  }

  securityQuestionOnChange(questionId: any){
    console.log(questionId);
  }

  onSubmit() {
    let questionId = this.editForm.get('securityQuestion').value;
    let qId = questionId === undefined ? this.QuestionId : questionId;
    const address = this.editForm.get('address').value;
    const contactNo = this.editForm.get('contactNo').value;
    const securityQuestionId =  this.editForm.get('securityQuestion').value;
    const answer = this.editForm.get('answer').value;
    console.log(this.file, address, contactNo, securityQuestionId, answer);
    this.authenticationService.updateProfile( this.file, address, contactNo, securityQuestionId, answer).subscribe( res => {
      console.log(res);
      if (res.status === 200) {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Profile update successfully'],
          timeout: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1000);
      }
    });
  }
  imgUpload(event) {
    let ext = $('#file').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Invalid image format'],
        timeout: 2000,
        type: 'danger'
      });
    } else {
      this.file = event.target.files[0];
      console.log(this.file);
      const reader = new FileReader();
      reader.onload = e => this.image = reader.result;
      reader.readAsDataURL(this.file);
    }
  }
  get email() {
    return this.editForm.get('email');
  }
  get address() {
    return this.editForm.get('address');
  }
  get contactNo() {
    return this.editForm.get('contactNo');
  }
  get securityQuestion() {
    return this.editForm.get('securityQuestion');
  }
  get answer() {
    return this.editForm.get('answer');
  }
}
