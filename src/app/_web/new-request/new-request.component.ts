import { NgFlashMessageService } from 'ng-flash-messages';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from './../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit, OnDestroy {
  allProjectsData = [];
  requestId;
  currentDateTime;
  submitted;
  form: FormGroup;


  constructor(private apiService: ApiService, private ngFlashMessageService: NgFlashMessageService, private router: Router, ) {
    this.apiService.getAllProject().subscribe(res => {
      this.allProjectsData = res.data;
      console.log(this.allProjectsData);
    });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
  }

  newRequest(subject, projectId, message) {

    this.currentDateTime = formatDate(new Date(), 'yyyy/MM/dd h:mm', 'en');
    console.log(subject, projectId, message);
    this.apiService.newRequest(subject, projectId, message, this.currentDateTime, this.requestId).subscribe(res => {

      console.log(res);
      if (res.status === 200) {
        this.ngFlashMessageService.showFlashMessage({
          messages: ["Successfully created request"],
          timeout: 3000,
          // type: 'danger'
        });
        this.router.navigate(['/support-request-listing-page']);
      }
      else {
        this.ngFlashMessageService.showFlashMessage({
          messages: [res.message],
          timeout: 3000,
          type: 'danger'
        });
      }
    });



  }

  ngOnInit() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.supportRequest').addClass('active');
    });

    this.requestId = Math.floor(Math.random() * (999999 - 100000)) + Math.floor(Math.random() * (1000 - 9999));
    console.log(this.requestId);

    this.form = new FormGroup({
      message: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      projects: new FormControl('', [Validators.required])
    });


    // console.log(new Date());

    console.log(this.currentDateTime);
  }
  get message() {
    return this.form.get('message');
  }
  get subject() {
    return this.form.get('subject');
  }
  get projects() {
    return this.form.get('projects');
  }

  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.supportRequest').removeClass('active');
    });
  }
}
