import { NgFlashMessageService } from 'ng-flash-messages';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from './../Services/api.service';
import { Component, OnInit } from '@angular/core';
import { MyValidators } from '../shared/Validation/externalValidator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.css']
})
export class AddBankAccountComponent implements OnInit {
  public addAccountForm: FormGroup;
  public stakeholderId: any;
  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private ngFlashMessageService: NgFlashMessageService, 
  private router: Router) { }
  ngOnInit() {
    let stakeholderDetail = JSON.parse(localStorage.getItem('currentUser'));
    this.stakeholderId = stakeholderDetail.userId;
    this.addAccountForm = this.formBuilder.group({
      accountNo: ['', [Validators.required, MyValidators.NumberOnly, Validators.maxLength(15)]],
      accountHolder: ['', Validators.required],
      bankName: ['', Validators.required],
      bankAddress: ['', Validators.required],
      abaNo: ['', [Validators.required, MyValidators.NumberOnly]],
      swiftCode: ['', Validators.required],
      routingNo: ['', [Validators.required, MyValidators.NumberOnly]],
      countryCode: ['',  [Validators.required, Validators.maxLength(4), MyValidators.NumberOnly]],
      // countryCode: ['', Validators.maxLength(2)],
    });
  }
 onSubmit() {
    // tslint:disable-next-line:one-variable-per-declaration
    let  accNo = this.addAccountForm.get('accountNo').value;
    let  abaNO = this.addAccountForm.get('abaNo').value;
    let  routeNo = this.addAccountForm.get('routingNo').value;
    let swiftCd = this.addAccountForm.get('swiftCode').value;
    // tslint:disable-next-line:one-variable-per-declaration
    let  countryCodeNo = this.addAccountForm.get('countryCode').value;
    let updateValue = {
      stakeholderId: this.stakeholderId,
      accountNo: accNo.toString(),
      stakeholderName: this.addAccountForm.get('accountHolder').value,
      bankName: this.addAccountForm.get('bankName').value,
      bankAddress: this.addAccountForm.get('bankAddress').value,
      abaNo: abaNO.toString(),
      swiftCode: swiftCd.toString(),
      routingNo: routeNo.toString(),
      countryCode: countryCodeNo.toString()
    };
    console.log(updateValue);
    this.apiService.AddBankDetail(updateValue).subscribe( res => {
      if ( res.status == 200 ) {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Bank Detail added successfully'],
          timeout: 1000,
        });
        setTimeout(() => {
          this.router.navigate(['/bank-account-details']);
        }, 1000);
      }
    });
  }
  get accountNo() {
    return this.addAccountForm.get('accountNo');
  }
  get accountHolder() {
    return this.addAccountForm.get('accountHolder');
  }
  get bankName() {
    return this.addAccountForm.get('bankName');
  }
  get bankAddress() {
    return this.addAccountForm.get('bankAddress');
  }
  get abaNo() {
    return this.addAccountForm.get('abaNo');
  }
  get swiftCode() {
    return this.addAccountForm.get('swiftCode');
  }
  get routingNo() {
    return this.addAccountForm.get('routingNo');
  }
  get countryCode() {
    return this.addAccountForm.get('countryCode');
  }
   
}
