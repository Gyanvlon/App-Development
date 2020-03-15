import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-bank-account-details',
  templateUrl: './bank-account-details.component.html',
  styleUrls: ['./bank-account-details.component.css']
})
export class BankAccountDetailsComponent implements OnInit {
  public detail: any;
  public noData: boolean = false;

  // variable decleare
  public accountNos: any;
  public accountHolders: any;
  public bankNames: any;
  public bankAddresss: any;
  public abaNos: any;
  public swiftCodes: any;
  public routingNos: any;
  public countryCodes: any;
  constructor(private apiService: ApiService, private route: ActivatedRoute,
    private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
   setTimeout ( () => {
    this.spinner.show();
   }, 1)
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    let stakeholderDetail = JSON.parse(localStorage.getItem('currentUser'));
    let stakeholderId = stakeholderDetail.userId;
    console.log(stakeholderDetail.userId);
    this.apiService.bankAccountDetail(stakeholderId).subscribe(res => {
      this.detail = res.data;
      let data = res.data.length;
      console.log(this.detail);
      function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    var myObj = this.detail; 
  if(isEmpty(myObj)) {
      this.noData = false;
  } else {
    this.noData = true;
  }
      console.log(this.detail);
      this.accountNos = res.data.accountNo;
      this.accountHolders = res.data.stackHolderName;
      this.bankNames = res.data.bankName;
      this.bankAddresss = res.data.bankAddress;
      this.abaNos = res.data.abaNo;
      this.swiftCodes = res.data.swiftCode;
      this.routingNos = res.data.routingNo;
      this.countryCodes = res.data.countryCode;
      console.log(this.accountNos);

    });

  }
  
}
