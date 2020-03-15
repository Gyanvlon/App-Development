import { NgFlashMessageService } from 'ng-flash-messages';
import { ApiService } from './../../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-edit-cama',
  templateUrl: './edit-cama.component.html',
  styleUrls: ['./edit-cama.component.css']
})
export class EditCamaComponent implements OnInit, OnDestroy {
  projectId;
  camaDetails = [];
  file;
  fileSrc;
  public projectName: any;

  // tslint:disable-next-line:max-line-length
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private ngFlashMessageService: NgFlashMessageService) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
    });
    this.projectDetails();
  }

  fileUpload(event) {

    this.file = event.target.files[0];
    if (this.file.type == 'application/pdf') {
      this.fileSrc = this.file.name;
      console.log(this.file.type);
    }
    else {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Only PDF files are allowed'],
        timeout: 2000,
        type: 'danger'
      });
      // const reader = new FileReader();
      // reader.onload = e => this.fileSrc = reader.result;
      // reader.readAsDataURL(this.file);
      // console.log(this.fileSrc);
    }
  }

  updateCama() {
    if (window.confirm('Are you sure, you want to change the document ?')) {
      this.apiService.editCama(this.file, this.projectId).subscribe(res => {
        console.log(res);
        if (res.status == 200) {
          // tslint:disable-next-line: no-unused-expression
          this.router.navigate(['/edit-project/' + this.projectId]);
        }
      });

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
    $(function () {
      console.log('im active');
      $('.navbar-default li.manageProject').addClass('active');
    });
    this.apiService.getDisplayProjectDetails
      (this.projectId).subscribe(res => {
        console.log(res);
        this.camaDetails = res.data;
        this.fileSrc = res.data[0].camaDocument;
        console.log(this.fileSrc);
      });
  }
  ngOnDestroy() {
    $(function () {
      console.log('im active');
      $('.navbar-default li.manageProject').removeClass('active');
    });
  }
}
