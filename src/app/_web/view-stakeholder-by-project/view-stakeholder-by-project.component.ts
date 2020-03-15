import { ApiService } from './../../Services/api.service';
import { ActivatedRoute, CanActivate } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-view-stakeholder-by-project',
  templateUrl: './view-stakeholder-by-project.component.html',
  styleUrls: ['./view-stakeholder-by-project.component.css']
})
export class ViewStakeholderByProjectComponent implements OnInit, OnDestroy {
  projectId: any;
  stakeholders: any;
  id;
  blank;
  public projectDetail;
  public projectName;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
      console.log(this.projectId);
    });


    // this.apiService.projectDetailStakeholders(this.projectId).subscribe(stakeholders => {
    //   console.log(stakeholders);
    //   this.stakeholders = stakeholders.data;
    // });
  }
  getId(StakeholderId) {
    console.log(StakeholderId);
    this.id = StakeholderId;
  }
  deleteStakeholder() {
    console.log(this.id);
    this.apiService.deleteStakeholder(this.id).subscribe(res => {
      this.stakeholders = this.stakeholders.filter(data =>
        data._id != this.id
      );
      console.log(res);
      if (res.status == 200) {
        console.log(res);
      }
    });
  }

  ngOnInit() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageProject').addClass('active');
    });
    this.apiService.projectDetailStakeholders(this.projectId).subscribe(stakeholders => {
      console.log(stakeholders);
      this.stakeholders = stakeholders.data;

      if (stakeholders.data.length == '0') {
        this.blank = true;
      }
    });
    this.projectDetails();

  }
  projectDetails() {
    this.apiService.getProjecttDetail(this.projectId).subscribe(res => {
      let projectDetail = res.data;
      this.projectName=projectDetail[0].projectName;
      console.log(this.projectName);
    });

  }
  ngOnDestroy() {
    console.log('destroying');
    $('.navbar-default li.manageProject').removeClass('active');

  }

}
