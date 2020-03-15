import { ApiService } from './../../Services/api.service';
import { AuthenticationService } from './../../Services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public p: any;
  public imageSrc: any = '/assets/img/prf-img.png';
  public file: File;
  public currentUserDetail: any;
  public image: any;
  public stakeholderDetail: any;
  public stakeholderId: any;
  public projectDetail: any;
  public project: any;
  public role: any;
  public liveProject: any[] =[];
  public pastProject: any[] =[];
  public isPast: boolean = false;
  public isLive: boolean = false;


  constructor(private authenticationService: AuthenticationService,
              private apiService: ApiService) {
  }
  ngOnInit() {
    this.currentUserDetail = this.authenticationService.currentUserDetail();
    this.stakeholderId = this.currentUserDetail.userId;
    this.apiService.stakeholderProfile(this.stakeholderId).subscribe(res => {
    this.stakeholderDetail = res.data;
    this.image = this.stakeholderDetail.stakeholderImage === null ? this.imageSrc : this.stakeholderDetail.stakeholderImage;
    console.log(this.stakeholderDetail);
    this.projectDetail = this.stakeholderDetail.projects;
    let detail = this.projectDetail.map( (data)  => data.projectId);
    let role = this.projectDetail.map( (data)  => data.role);
    let details = this.projectDetail.map( ({currentStatus})  => currentStatus);
    this.project = this.projectDetail[0].projectId;
    console.log(this.projectDetail);
    console.log(role);
    console.log(detail);
    // let liveStatus: any[] = [];
    for( let i =0;  i< this.projectDetail.length; i++) {
      if(this.projectDetail[i].projectId.currentStatus == 'In Progress'){
       this.liveProject.push(this.projectDetail[i])
        console.log('here is if' ,this.liveProject.length);
        // if ( this.liveProject.length == 0) {
        // console.log('live project is blank', this.liveProject);
        //   this.isBlank = true;
        // }
      } 
      if(this.projectDetail[i].projectId.currentStatus == 'Completed'){
        // this.blank = true;
        this.pastProject.push(this.projectDetail[i])
        console.log('here is else', this.pastProject)
        // if ( this.pastProject.length == 0) {
        //   this.isBlank = true;
        // console.log('past project is blank', this.pastProject);

        // }
      }
      console.log(detail[i].currentStatus);
    }
    if ( this.pastProject.length == 0) {
      this.isPast = true;
    console.log('past project is blank', this.pastProject);

    }
    if(this.liveProject.length == 0) {
      console.log('live project is blank', this.liveProject);
         this.isLive = true;
      }
    // this.liveProject =liveStatus;
    // console.log('here is live project' , this.liveProject);




    this.role = this.projectDetail[0].role;
    console.log(this.role);
      // let img = res.data.stakeholderImage;
      // console.log(img);
      // if (img === null) {
      //   this.stakeholderImage = this.imageSrc;
      // } else {
      //   this.stakeholderImage = img;
      // }
      // this.project = this.stakeholderDetail.projects[];
    });


  }


}
