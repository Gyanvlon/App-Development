import { ConvertTimeService } from './../../Services/convert-time.service';
import { NgFlashMessageService } from 'ng-flash-messages';
// import { ExternaljsService } from './../../shared/externaljs.service';
import { ApiService } from '../../Services/api.service';
// import { GetDetailsService } from './../../Services/get-details.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import {Get}

@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css']
})
export class ManageProjectComponent implements OnInit {
  public p: number;
  projects: any[] = [];
  activeId;
  date; //try
  public blank: boolean = false;


  filteredProjects: any[] = [];
  constructor(private apiService: ApiService,
    private router: Router,
    private ngFlashMessageService: NgFlashMessageService,
    private convertTimeService: ConvertTimeService

    // private externaljsService: ExternaljsService
  ) {
    // private getDetailsService: GetDetailsService
    // this.getApiData();
  }
  getApiData() {
    this.apiService.getAllProject().subscribe(res => {
      // this.manageProject = res.data;
      console.log(res);
      this.projects = res.data;
      console.log(this.projects);
      this.date = this.projects[0].updatedAt;
      console.log(this.date);
      if (res.data.length == '0') {
        this.blank = true;
      }
    });
    this.convertTimeService.getTime(this.date);

  }

  getDeleteActiveId(id) {
    // to get active id so that to delete
    this.activeId = id;

    
  }
  deleteProject() {

    this.apiService.deleteProject(this.activeId).subscribe(res => {
      console.log(res);
      this.projects = this.projects.filter(data =>
        data._id != this.activeId
      );
      if (res.status === 200) {
        console.log('delete');
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Successfully Deleted'],
          timeout: 2000
          // type: 'success'
        });
        this.router.navigate(['/manage-projects']);
      }
    });
  }

  ngOnInit() {
    this.getApiData();
    // this.externaljsService.initializedInspinia();

  }
}
