import { ApiService } from './../../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stakeholders-account',
  templateUrl: './stakeholders-account.component.html',
  styleUrls: ['./stakeholders-account.component.css']
})
export class StakeholdersAccountComponent implements OnInit ,OnDestroy{
public p: any;
public projects: any;
public accountDetail: any;
public blank: boolean = false;
public  firstProject: any;
  constructor( private apiService: ApiService) {
  }
  ngOnInit() {
 //  this.getProjectId(id);
   this.apiService.getAllProject().subscribe( res => {
  this.projects = res.data; 
  let firstProjectId = res.data[0]._id;
  this.firstProject = res.data[0].projectName;
  this.apiService.getAccountByProjecId(firstProjectId).subscribe( res => {
    this.accountDetail = res.data;
    let accNo = this.accountDetail.map((accountNo) =>accountNo )
    let  accountNo = (res.data[0].accountNo).toString();
    // var str="1234567812345678"; //VERY BAD: Credit Card # *unencrypted* in source!
    let n = accountNo.replace(/.(?=.{4})/g, 'x');
    console.log(accNo);
    this.accountDetail.forEach(acc => {
      let acss = (acc.accountNo).toString();
      let addN =  acss.replace(/.(?=.{4})/g, 'x');
      acc.accountNo = addN
    });
     console.log(this.accountDetail); 
    //  if (res.data.length == '0') {
    //   this.blank = true;
    // }
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  var myObj = this.accountDetail; 
  if(isEmpty(myObj)) {
  console.log('len');
    this.blank = true;
  } else {
  this.blank = false;
  console.log('lensss');
  }
  });

  console.log(this.projects);
  console.log(this.firstProject);


});

    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').addClass('active');
    });
  }
  getProjectId(event) { 
    let data = ((event.target.value).split(':'));
    console.log(data);
    let id = (data[1]);
    console.log(id);
    this.apiService.getAccountByProjecId(id.trim()).subscribe( res => {
    this.accountDetail = res.data;
    this.accountDetail.forEach(acc => {
      let acss = (acc.accountNo).toString();
      let addN =  acss.replace(/.(?=.{4})/g, 'x');
      acc.accountNo = addN
    });
     console.log(this.accountDetail); 
    //  if (res.data.length == '0') {
    //   this.blank = true;
    // }
    function isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }
  var myObj = this.accountDetail; 
  if(isEmpty(myObj)) {
  console.log('len');
    this.blank = true;
  } else {
  this.blank = false;
  console.log('lensss');
  }
    });
      
  }
  ngOnDestroy(){
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageStakeholders').removeClass('active');
    });
  }

}
