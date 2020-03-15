import { NgFlashMessageService } from 'ng-flash-messages';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../Services/api.service';
import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment'; // to formt data from api

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit, OnDestroy {
  editProjectDetails = [];
  projectId;

  PressArticles = [];

  imageSrc;
  file;
  showImg = true;
  fileSrc;
  public projectName: any;

  submitButtonValidity = false;
  projectStartDate;
  constructor(private router: Router, public apiService: ApiService,
    private route: ActivatedRoute, private formBuilder: FormBuilder, private ngFlashMessageService: NgFlashMessageService) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
    });

    this.apiService.getDisplayProjectDetails(this.projectId).subscribe(res => {
      console.log(res);
      this.editProjectDetails = res.data;

      // if (this.imageSrc == 'null' || 'undefined') {
      //   console.log('inside if');
      //   this.imageSrc = '/assets/img/movie-placeholder.jpg';
      // }
      // else {
      //   this.imageSrc = this.editProjectDetails[0].projectImage; // setting image source dynamically
      // }
      this.imageSrc = this.editProjectDetails[0].projectImage; // setting image source dynamically
      this.PressArticles = this.editProjectDetails[0].pressAndArticles; // setting press and article dynamically
      this.projectStartDate = moment(this.editProjectDetails[0].startDate).format('YYYY/MM/DD'); // to formt data from api
      console.log(this.imageSrc);
      if (this.imageSrc == null || undefined) {
        console.log('inside if');
        this.imageSrc = '/assets/img/movie-placeholder.jpg';
      }
      // else {
      //   this.imageSrc = this.editProjectDetails[0].projectImage; // setting image source dynamically
      // }
      console.log(this.PressArticles);

      const item = { // adding empty fields to display on html page
        name: '',
        link: ''
      };
      this.PressArticles.push(item);

    });
    this.projectDetails();


  }

  // add new name and link for press and article

  addButtonClick(): void { // Adding item from pressAndArticle html to ts
    const item = {
      name: '',
      link: ''
    };
    this.PressArticles.push(item);
    console.log(this.PressArticles);
  }
  removeButtonClick(index) { // removing item from pressAndArticles on the event form HTML

    console.log(index);
    this.PressArticles.splice(index, 1);
  }
  // to add image by new path
  imgUpload(event) {
    let ext = $('#file').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
      this.ngFlashMessageService.showFlashMessage({
        messages: ['Invalid image format. Please Enter Valid Image'],
        timeout: 2000,
        type: 'danger'
      });
    } else {
      this.file = event.target.files[0];
      console.log(this.file);
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.file);
    }


    // this.file = event.target.files[0];
    // console.log(this.file.name);
    // const reader = new FileReader();
    // reader.onload = e => this.imageSrc = reader.result;
    // reader.readAsDataURL(this.file);


  }
  updateProject(projectDescription, projectStartDate) {

    if (projectDescription === '' || projectStartDate === '' || projectDescription === ' ' || projectStartDate === ' ') {
      window.scroll(0, 0);
      this.ngFlashMessageService.showFlashMessage({
        messages: ["Fields can't be empty"],
        timeout: 1000,
        type: 'danger'
      });
    } else {

      console.log(this.submitButtonValidity);

      console.log(projectDescription, projectStartDate);
      console.log(this.PressArticles);
      const filteredPressArticle = this.PressArticles.filter(t => t.name !== ''); // Filter empty data from an array
      const data = JSON.stringify(filteredPressArticle);
      console.log(filteredPressArticle);


      this.apiService.EditProjectDetails(projectDescription, projectStartDate,
        data, this.projectId, this.file).subscribe(res => {
          console.log('res', res);
          if (res.status === 200) {
            window.scroll(0, 0);
            this.ngFlashMessageService.showFlashMessage({
              messages: ['Project details update successfully.'],
              timeout: 1000,
            });
            setTimeout(() => {
              this.router.navigate(['/manage-projects']);
            }, 1000);

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

  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageProject').removeClass('active');
    });
  }
}
