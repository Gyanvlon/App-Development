import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-gross-revenue',
  templateUrl: './gross-revenue.component.html',
  styleUrls: ['./gross-revenue.component.css']
})
export class GrossRevenueComponent implements OnInit {
  public listOfTransaction: any;
  public p: any;
  public isblank: boolean = false;
  public netRevenue: any;
  // projectId: any;
  constructor(private apiService: ApiService, private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    setTimeout ( () => {
      this.spinner.show();
     }, 1)
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
   let projectId = JSON.parse(localStorage.getItem('projectId'));
   console.log(projectId);
   this.apiService.listOfTransaction(projectId).subscribe( res => {
     this.netRevenue = res.data.netRevenue;
    this.listOfTransaction = res.data.transactions;
    console.log(this.listOfTransaction.transactions);
    function isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
  }
  var myObj =res.data; 
if(isEmpty(myObj)) {
    this.isblank = true;
} else {
  this.isblank = false;
}
    if(this.listOfTransaction.length == 0) {
      this.isblank = true;
    }
})
}
}
