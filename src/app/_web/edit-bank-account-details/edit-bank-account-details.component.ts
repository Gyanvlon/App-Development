import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';
import { MyValidators } from 'src/app/shared/Validation/externalValidator';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-bank-account-details',
  templateUrl: './edit-bank-account-details.component.html',
  styleUrls: ['./edit-bank-account-details.component.css']
})
export class EditBankAccountDetailsComponent implements OnInit,OnDestroy {
  public detail: any;
  public AcctEditForm: FormGroup;
  public stakeholderId: any;
  public newDetail: boolean = false;


  // variable decleare
  public accountNos: any;
  public accountHolders: any;
  public bankNames: any;
  public bankAddresss: any;
  public abaNos: any;
  public swiftCodes: any;
  public routingNos: any;
  public countryCodes: any;
  constructor(private apiService: ApiService,
              private formBuilder: FormBuilder,
              private ngFlashMessageService: NgFlashMessageService,
              private router: Router,
              private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
    setTimeout ( () => {
      this.spinner.show();
     }, 2)
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
  
    $(function () {
      console.log('im active');
      $('.navbar-default li.bankAccount').addClass('active');
    });
    let stakeholderDetail = JSON.parse(localStorage.getItem('currentUser'));
    this.stakeholderId = stakeholderDetail.userId;
    console.log(stakeholderDetail.userId);
    this.apiService.bankAccountDetail(this.stakeholderId).subscribe( res => {
    this.accountNos = res.data.accountNo;
    this.accountHolders = res.data.stackHolderName;
    this.bankNames = res.data.bankName;
    this.bankAddresss = res.data.bankAddress;
    this.abaNos = res.data.abaNo;
    this.swiftCodes = res.data.swiftCode;
    this.routingNos = res.data.routingNo;
    this.countryCodes = res.data.countryCode;
    console.log(res.data);
    });
    this.AcctEditForm = this.formBuilder.group({
      accountNo: ['', [Validators.required, MyValidators.NumberOnly, Validators.maxLength(15)]],
      accountHolder: ['', Validators.required],
      bankName: ['', Validators.required],
      bankAddress: ['', Validators.required],
      abaNo: ['', [Validators.required, MyValidators.NumberOnly]],
      swiftCode: ['', Validators.required],
      routingNo: ['', [Validators.required, MyValidators.NumberOnly]],
      countryCode: ['',  [Validators.required, Validators.maxLength(4), MyValidators.NumberOnly]],
    });
  }
  
  onSubmit() {
    let  accNo = this.AcctEditForm.get('accountNo').value;
    let  abaNO = this.AcctEditForm.get('abaNo').value;
    let  routeNo = this.AcctEditForm.get('routingNo').value;
    let swiftCd = this.AcctEditForm.get('swiftCode').value;
    let  countryCodeNo = this.AcctEditForm.get('countryCode').value;
    let updateValue = JSON.stringify({
      stakeholderId: this.stakeholderId,
      accountNo: accNo.toString(),
      stakeholderName: this.AcctEditForm.get('accountHolder').value,
      bankName: this.AcctEditForm.get('bankName').value,
      bankAddress: this.AcctEditForm.get('bankAddress').value,
      abaNo: abaNO.toString(),
      swiftCode: swiftCd.toString(),
      routingNo: routeNo.toString(),
      countryCode: countryCodeNo.toString()
    });
    console.log(updateValue);
    this.apiService.editbankDetail(updateValue).subscribe( res => {
      if ( res.status == 200 ) {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Bank Detail update successfully'],
          timeout: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/bank-account-details']);
        }, 1000);
      }
    });
  }
  get accountNo() {
    return this.AcctEditForm.get('accountNo');
  }
  get accountHolder() {
    return this.AcctEditForm.get('accountHolder');
  }
  get bankName() {
    return this.AcctEditForm.get('bankName');
  }
  get bankAddress() {
    return this.AcctEditForm.get('bankAddress');
  }
  get abaNo() {
    return this.AcctEditForm.get('abaNo');
  }
  get swiftCode() {
    return this.AcctEditForm.get('swiftCode');
  }
  get routingNo() {
    return this.AcctEditForm.get('routingNo');
  }
  get countryCode() {
    return this.AcctEditForm.get('countryCode');
  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.bankAccount').removeClass('active');
    });
  }
 
}
