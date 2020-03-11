import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ProviderServiceService } from "../../../app/shared/services/provider-service.service";
import { UserService } from '../../shared/services/user.service';
import * as $ from "jquery";
import * as moment from 'moment';
@Component({
    selector: 'app-accountinfo',
    templateUrl: './accountinfo.component.html',
    styleUrls: ['./accountinfo.component.css']
})
export class AccountinfoComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public loggedInUserData: Array<any> = [];
    public phoneNumberModel: string = "";
    public firstNameModel: string = "";
    public lastNameModel: string = "";
    public companynameModel: string = "";
    public birthday: string = "";
    public userSavedCards: Array<any> = [];
    public companyaddressModel: string = "";
    public userDeliveryAddressToUse = {};
    closeResult: string;
    public formSubmitted: boolean;
    accountform: FormGroup;
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService
    ) {
        this.initForm();
    }
    initForm() {
        this.accountform = this.fb.group({
            phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
            firstname: ['', [Validators.required]],
            lastname: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            birthdayy: ['', [Validators.required, this.checkInvalidDate, this.maxDate]]
        },
       )
    }
    checkInvalidDate(control: AbstractControl): { invalidDate: boolean } {
        if (control.value == '') {
            return null;
        }
        let date = moment(control.value, "MM/DD/YYYY", true);
        moment().isBefore(date);
        if (!date.isValid()) {
            return { 'invalidDate': true }
        }
        return null;
    }
    maxDate(control: AbstractControl): { maxDate: any } {
        let date = moment(control.value, "MM/DD/YYYY", true);
        var years = moment().diff(date, 'years');
        if (date.isValid() && years < 21) {
            return { 'maxDate': moment().subtract('21', "years").year() }
        }
        return null;
    }
    public onSaveProfile() {
        if (!this.accountform.valid) {
            this.formSubmitted = true;
            return;
        }
        this.formSubmitted = false;
        this.userService.showAppSpinner();
        let accountData: Object = {
            "firstName": this.accountform.get('firstname').value,
            "lastName": this.accountform.get('lastname').value,
            "displayName": this.accountform.get('firstname').value,
            "phoneNumber": this.accountform.get('phoneNumber').value,
            "email": this.accountform.get('email').value,
            "birthday": moment(this.accountform.get('birthdayy').value, 'MM/DD/YYYY').format('YYYY-MM-DD')
        };
               this.ProviderServiceService.updateProfile(accountData)
            .subscribe(data => {
                this.userService.hideAppSpinner();
                this.userService.showflashMessage("success", "Account details saved successfully");
                window.scrollTo(0, 0);
                this.userService.setCurrentUserData(data);
            }, error => {
                if (error.message == "Authorization Required" || error.message == "Invalid Access Token" || error.statusText == "Unauthorized") {
                    this.userService.setLoginPopupCheck('true');
                }
            });
    }
    get password() { return this.accountform.get('password'); }
    get confirm_password() { return this.accountform.get('confirm_password'); }
    get phoneNumber() { return this.accountform.get('phoneNumber'); }
    get email() { return this.accountform.get('email'); }
    get birthdayy() { return this.accountform.get('birthdayy'); }
    get firstname() { return this.accountform.get('firstname'); }
    get lastname() { return this.accountform.get('lastname'); }
    get companyname() { return this.accountform.get('companyname'); }
    get companyaddress() { return this.accountform.get('companyaddress'); }
    ngOnInit() {
        this.userService.showAppSpinner();
        this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
            .subscribe(data => {
                this.userService.setCurrentUserData(data);
                this.phoneNumberModel = data.phoneNumber;
                this.companynameModel = data.companyName;
                this.companyaddressModel = data.address;
                this.birthday = moment(data.birthday, 'YYYY-MM-DD').format('MM/DD/YYYY');
                if (this.birthday === 'Invalid date') {
                    this.birthday = '';
                }
                this.ProviderServiceService.getUserSavedCards(data => {
                    this.userSavedCards = data.sources.data;
                });
                this.firstNameModel = data.firstName;
                this.lastNameModel = data.lastName;
                this.userService.hideAppSpinner();
            }, error => {
                if (error.message == "Authorization Required" || error.message == "Invalid Access Token" || error.statusText == "Unauthorized") {
                    this.userService.setLoginPopupCheck('true');
                }
                this.userService.hideAppSpinner();
            });
        this.userService.setCustomJsToFormData();//to set custom js to form data
        setInterval(() => {
            if (this.userService.getLoginPopupCheck() == "true") {
                $("#openLogoutPopup").trigger("click");
                this.userService.setLoginPopupCheck('false');
            }
        }, 500);
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
        } else {
            this.userService.setIsLocation(true);
        }
    }
    ngAfterContentChecked() {
        this.loggedInUserData = (this.isUserLoggedIn) ? this.userService.getCurrentUserData() : [];
        this.isUserLoggedIn = this.userService.isLoggedIn();
    }
      public deleteCard(args: any) {
        this.ProviderServiceService.deleteUserSavedCards($(args.currentTarget).data('card-id'), data => {
            this.ProviderServiceService.getUserSavedCards(data => {
                this.userSavedCards = data.sources.data;
            });
        });
    }
    public setdefaultCard(id) {
        $("#cardsDetails .labelItems").removeClass("selected");
        this.ProviderServiceService.setUserDefaultCard(id, data => {
        });
    }
}
