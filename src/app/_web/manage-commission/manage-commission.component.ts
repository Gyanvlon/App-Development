import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-commission',
  templateUrl: './manage-commission.component.html',
  styleUrls: ['./manage-commission.component.css']
})
export class ManageCommissionComponent implements OnInit {
public p: any;
public allProject: any;
public commissionDetail: any;
public blank: boolean = false;
public firstProject: any;
  constructor(private apiService: ApiService, private router: Router) {
  }
  ngOnInit() {
    this.apiService.getAllProject().subscribe( res => {
      this.allProject = res.data;
     console.log('here is datas', this.allProject);
    console.log(this.firstProject);
    let firstProjectId = res.data[0]._id;
    console.log(firstProjectId);
  this.firstProject = res.data[0].projectName;
  this.apiService.getCommission(firstProjectId).subscribe( res => {
    this.commissionDetail = res.data;
     console.log(this.commissionDetail); 
     if (res.data.length == 0) {
      this.blank = true;
    }
  });
  console.log(this.firstProject);

     })
  }
  getProjectId(event) {
    let data = ((event.target.value).split(':'));
    console.log(data);
    let id = (data[1]);
    console.log(id);
   // console.log(event);
    this.apiService.getCommission(id.trim()).subscribe( res => {
    this.commissionDetail = res.data;
   // this.commissionDetail = data.Record;
    console.log(this.commissionDetail);
    console.log(res.data);

    if (res.data.length == '0') {
      this.blank = true;
    }
    else {
      this.blank = false;
    }
  
    });
  }

}
