import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-money-paid',
  templateUrl: './money-paid.component.html',
  styleUrls: ['./money-paid.component.css']
})
export class MoneyPaidComponent implements OnInit {
  public isblank: boolean = false;
  public listOfTransaction: any;
  public p: any;

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
    this.apiService.moneyDistribution(projectId).subscribe( res => {
      this.listOfTransaction = res.data;
      console.log(this.listOfTransaction)
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
