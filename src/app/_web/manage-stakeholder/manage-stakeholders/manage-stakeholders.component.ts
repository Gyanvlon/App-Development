import { Router } from '@angular/router';
import { ApiService } from './../../../Services/api.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-manage-stakeholders',
  templateUrl: './manage-stakeholders.component.html',
  styleUrls: ['./manage-stakeholders.component.css']
})
export class ManageStakeholdersComponent implements OnInit {
  public p: number;
  public stakeHolderDetails: any[] = [];
  public activeId: any;
  public id: any;
  public allProjectsData: any;
  public stakeholders: any;
  public blank: boolean = false;
  public currentId: any;
  public selectedValue: any;
  constructor(private apiService: ApiService,
              private ngFlashMessageService: NgFlashMessageService,
              private router: Router) {
  }
  ngOnInit() {
    // ------------------------------my work---------------------------------------------
    this.apiService.getAllProject().subscribe(res => {
      this.allProjectsData = res.data;
      // console.log('data', this.allProjectsData);
      this.currentId = this.allProjectsData[0]._id;

      this.selectedValue = this.currentId;

      this.apiService.projectDetailStakeholders(this.currentId).subscribe(stakeholders => {
        console.log(stakeholders, " ", this.currentId);
        this.stakeholders = stakeholders.data;

        // if (stakeholders.data.length == '0') {
        //   this.blank = true;
        // }
        // else {
        //   this.blank = false;
        // }
      });
    });
  }
  stakeholdersData(id) {
    console.log(id);

  }
  getData(event) {
    let data = ((event.target.value).split(':'));
    let id = (data[1]);
    this.apiService.projectDetailStakeholders(id).subscribe(stakeholders => {
      console.log(stakeholders);
      // console.log(id);
      this.stakeholders = stakeholders.data;

      if (stakeholders.data.length == '0') {
        this.blank = true;
      }
      else {
        this.blank = false;
      }
    });
  }
  getId(StakeholderId) {
    console.log('id', StakeholderId);
    this.activeId = StakeholderId;
  }
  deleteStakeholders(): void {
    console.log('activate id', this.activeId);
    this.apiService.deleteStakeholder(this.activeId).subscribe(res => {
      this.stakeholders = this.stakeholders.filter(data => {
        data._id != this.activeId;
        console.log(data._id);
      });
      console.log(res);
      if (res.status == 200) {
        console.log(res);
        this.ngFlashMessageService.showFlashMessage({
          messages: ['stakeholder delete successfully'],
          timeout: 1000
        });
      }
    });
  }
}
