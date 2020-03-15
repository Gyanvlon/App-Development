import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cama-contracts',
  templateUrl: './cama-contracts.component.html',
  styleUrls: ['./cama-contracts.component.css']
})
export class CamaContractsComponent implements OnInit {
public p:any;
public detail: any;
public blank: boolean = false;
public stakeholderId: any;
  constructor(private apiService: ApiService) {
  }
  ngOnInit() {
    let stakeholderDetail = JSON.parse(localStorage.getItem('currentUser'));
    this.stakeholderId = stakeholderDetail.userId;
    console.log(this.stakeholderId);
      this.apiService.stakeholderProfile(this.stakeholderId).subscribe(res => {
        // this.manageProject = res.data;
        console.log(res);
        this.detail = res.data.projects;
        console.log(this.detail);
        if (res.data.length == '0') {
          this.blank = true;
        }
      });
      
  }

}
