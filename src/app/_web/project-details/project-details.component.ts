import { ApiService } from '../../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment'; // to formt data from api
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit,OnDestroy {
  projectDetails: any[] = [];
  projectId: any;
  projectStartDate: any;
  stakeholders:any;
  id;
  blank;
  constructor(private apiService: ApiService, private route: ActivatedRoute, 
    private router: Router) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
      console.log(this.projectId);
    });
    // $(function () {
    //   // console.log('im active');
    //   $('.navbar-default li.dashboard').addClass('active');
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
    // this.apiService.setProjectID(this.projectId);
    this.apiService.getProjecttDetail(this.projectId).subscribe(projectDetail => {
      this.projectDetails = projectDetail.data;
      console.log(this.projectDetails);
      this.projectStartDate = moment(this.projectDetails[0].startDate).format('YYYY/MM/DD');
      console.log(this.projectStartDate);
    });
    // stakeholders data
    this.apiService.projectDetailStakeholders(this.projectId).subscribe(stakeholders => {
      console.log(stakeholders);
      this.stakeholders=stakeholders.data;

      if (stakeholders.data.length == '0') {
        this.blank = true;

      }
    });
  }
  setProject() {
    localStorage.setItem('projectId', JSON.stringify(this.projectId));
    this.router.navigate(['/project-insight']);
  }
  ngOnDestroy(){
    $(function () {
      console.log('im dstroying');
      $('.navbar-default li.manageProject').removeClass('active');
    });
  }
}
