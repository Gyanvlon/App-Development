import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from './../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-request-detail-page',
  templateUrl: './support-request-detail-page.component.html',
  styleUrls: ['./support-request-detail-page.component.css']
})
export class SupportRequestDetailPageComponent implements OnInit {
  type: any;
  projectId: any;
  pendingRequest: any;
  stakeholderName: any;
  filterRequest: any;
  comment: any;
  currentRequestId: any;
  form: FormGroup;
  submitted: any;
  disabled: boolean = false;
  myIssues: boolean = false;
  blank: boolean = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    route.params.subscribe(val => {
      this.type = this.route.snapshot.paramMap.get('type');
      this.projectId = this.route.snapshot.paramMap.get('id');
      console.log(this.projectId, this.type);
      this.apiService.getAllSupportRequestsForProject(this.projectId, this.type).subscribe(data => {
        console.log(data);
        this.pendingRequest = data.data;
        console.log(this.pendingRequest.length);
        if (this.pendingRequest.length == '0') {
          this.blank = true;
        }
        else {
          this.filterRequest = this.pendingRequest[0];
          this.currentRequestId = this.filterRequest._id;
          console.log(this.filterRequest);
        }
      });
    });


    if (this.type == 'Resolved') {
      this.disabled = true;
    }
    else if (this.type == 'Pending') {
      this.disabled = false;
    }
    else if (this.type == 'myIssues') {
      this.myIssues = true;
      console.log("MyISSUES",this.myIssues);
      this.disabled = false;
    }

  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      comments: new FormControl('', [Validators.required]),
    });
    this.apiService.getAllSupportRequestsForProject(this.projectId, this.type).subscribe(data => {
      console.log(data);

      this.pendingRequest = data.data;
      if (this.pendingRequest.length == '0') {
        this.blank = true;
        console.log(this.blank);
      }
      else {
        this.filterRequest = this.pendingRequest[0];
        this.currentRequestId = this.filterRequest._id;
        console.log(this.filterRequest);
      }
    });
  }
  requests(id) {
    console.log(id);
    this.currentRequestId = id;
    let data = this.pendingRequest.filter(request => request._id === id);
    this.filterRequest = data[0];
    console.log(this.filterRequest);
  }

  newComment() {
    console.log(this.currentRequestId, this.comment);
    this.apiService.addNewComment(this.currentRequestId, this.comment).subscribe(data => {
      console.log(data);
      this.requests(this.currentRequestId);
      this.apiService.getAllSupportRequestsForProject(this.projectId, this.type).subscribe(data => {
        console.log(data);

        this.pendingRequest = data.data;
        this.currentRequestId = this.currentRequestId;
        let data1 = this.pendingRequest.filter(request => request._id === this.currentRequestId);
        this.filterRequest = data1[0];
        console.log(this.filterRequest);
      });

    });
    this.comment = '';

  }
  resolveIssues() {
    console.log(this.currentRequestId);
    this.apiService.resolveIssues(this.currentRequestId).subscribe(res => {
      console.log(res);
      this.apiService.getAllSupportRequestsForProject(this.projectId, this.type).subscribe(data => {
        console.log(data);

        this.pendingRequest = data.data;
        this.filterRequest = this.pendingRequest[0];
        this.currentRequestId = this.filterRequest._id;
        console.log(this.filterRequest);
      });
    });
  }
  get comments() {
    return this.form.get('comments');
  }
}
