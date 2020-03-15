import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment'; // to formt data from api


@Component({
  selector: 'app-universal-message',
  templateUrl: './universal-message.component.html',
  styleUrls: ['./universal-message.component.css']
})
export class UniversalMessageComponent implements OnInit, OnDestroy {
  projectId;
  messageHistory;
  form: FormGroup;
  submitted: Boolean = false;
  public projectName: any;



  constructor(private route: ActivatedRoute, public apiService: ApiService) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
    });
    this.projectDetails();
  }

  getUniversalMessage(Message) {
    const message = {

      message: Message

    };
    console.log(message);
    this.apiService.getUniversalMessage(this.projectId, message).subscribe(res => {
      console.log(res);
      this.message.setValue(" ");
      this.ngOnInit();
    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
  }
  projectDetails() {
    this.apiService.getProjecttDetail(this.projectId).subscribe(res => {
      let projectDetail = res.data;
      this.projectName = projectDetail[0].projectName;
      console.log(this.projectName);
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      message: new FormControl('', [
        Validators.required])
    });



    this.apiService.getProjecttDetail(this.projectId).subscribe(res => {
      console.log(res);
      this.messageHistory = res.data;
    });
    // this.dateAndTime = moment(this.messageHistory[0].universalMessage.date).format('YYYY/MM/DD'); // to formt data from api

    $(function () {
      console.log('im active');
      $('.navbar-default li.manageProject').addClass('active');
    });

  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageProject').removeClass('active');
    });
  }
  get message() {
    return this.form.get('message');
  }

}
