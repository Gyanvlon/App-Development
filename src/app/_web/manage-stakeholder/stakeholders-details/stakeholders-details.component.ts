import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stakeholders-details',
  templateUrl: './stakeholders-details.component.html',
  styleUrls: ['./stakeholders-details.component.css']
})
export class StakeholdersDetailsComponent implements OnInit, OnDestroy {
  public imageSrc: any = '/assets/img/prf-img.png';
  public stakeholderId: any;
  public stakeholderDetail: any;
  public project: any;
  public projectDetail: any;
  public role: any;
  public stakeholderImage: any;
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.stakeholderId = this.route.snapshot.paramMap.get('id');
      console.log(this.stakeholderId);
    });
  }
  ngOnInit() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').addClass('active');
    });
    this.apiService.stakeholderProfile(this.stakeholderId).subscribe(res => {
      console.log(res.data);
      this.stakeholderDetail = res.data;
      this.projectDetail = this.stakeholderDetail.projects;
      this.project = this.projectDetail[0].projectId;
      console.log(this.projectDetail[0].projectId);
      this.role = this.projectDetail[0].role;
      console.log(this.role);
      let img = res.data.stakeholderImage;
      console.log(img);
      if (img === null ) {
        this.stakeholderImage = this.imageSrc;
      } else {
        this.stakeholderImage = img;
      }
      // this.project = this.stakeholderDetail.projects[];
    });
  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').removeClass('active');
    });
  }
}
