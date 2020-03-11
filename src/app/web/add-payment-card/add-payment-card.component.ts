import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProviderServiceService } from "../../../app/shared/services/provider-service.service";
import { UserService } from '../../shared/services/user.service';
import * as $ from "jquery";
@Component({
    selector: 'app-add-payment-card',
    templateUrl: './add-payment-card.component.html',
    styleUrls: ['./add-payment-card.component.css']
})
export class AddPaymentCardComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public loggedInUserData: Array<any> = this.userService.getCurrentUserData();
    public d = new Date();
    public currentYear = this.d.getFullYear();
    public currentMonth = this.d.getMonth();
    public submitIsDisabled: boolean = false;
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router
    ) { }
    ngOnInit() {
        // this.ProviderServiceService.getUserSavedCards();
        this.userService.setCustomJsToFormData();//to set custom js to form data
    }
    saveCardDetailsToStripe() {
        this.userService.showAppSpinner();
        let isError = false;
        this.submitIsDisabled = true;
        if ($("[name='cvv']").val() == "" || $("[name='zip']").val() == "" || $("[name='name']").val() == "" || $("[name='number']").val() == "" || $("[name='month']").val() == "") {
            window.scrollTo(0, 0);
            this.userService.showflashMessage("danger", "Please fill in all the details to continue");
            this.userService.hideAppSpinner();
            this.submitIsDisabled = false;
            return true;
        }
        let cardDetail = {
            name: $("[name='name']").val(),
            number: $("[name='number']").val(),
            exp_month: $("[name='month']").val().split('/')[0].trim(),
            exp_year: $("[name='month']").val().split('/')[1].trim(),
            zipcode: $("[name='zip']").val(),
            cvc: $("[name='cvv']").val()
        }
        //Month Validation
        if (cardDetail.exp_month == "") {
            this.userService.showflashMessage("danger", "Expiry Month is required");
            isError = true;
        } else {
            if (isNaN(cardDetail.exp_month)) {
                this.userService.showflashMessage("danger", "Expiry month should be a valid number");
                isError = true;
            } else if (cardDetail.exp_month < 1 || cardDetail.exp_month > 12) {
                this.userService.showflashMessage("danger", "Expiry Month should be 1 and 12");
                isError = true;
            }
        }
        //Year Validation
        if (cardDetail.exp_year == "") {
            this.userService.showflashMessage("danger", "Expiry Year is requried");
            isError = true;
        } else if (cardDetail.exp_year.length < 4 || isNaN(cardDetail.exp_month)) {
            this.userService.showflashMessage("danger", "Expiry Year should be a valid 4-digit number");
            isError = true;
        } else if (cardDetail.exp_year == this.currentYear && cardDetail.exp_month < this.currentMonth) {
            this.userService.showflashMessage("danger", "Card is already expired");
            isError = true;
        } else if (cardDetail.exp_year < this.currentYear) {
            this.userService.showflashMessage("danger", "Expiry Year should be greater than current year");
            isError = true;
        }

        //CVV Validation
        if (cardDetail.cvc == "") {
            this.userService.showflashMessage("danger", "CVV is required");
            isError = true;
        } else if (cardDetail.cvc.length < 3 || isNaN(cardDetail.cvc)) {
            this.userService.showflashMessage("danger", "CVV should be valid 3-digit number");
            isError = true;
        }

        if (isError) {
            window.scrollTo(0, 0);
            this.userService.hideAppSpinner();
            this.submitIsDisabled = false;
            return true;
        } else {
            this.ProviderServiceService.addUserSavedCards(cardDetail, response => {
                if (response.id) {
                    this.userService.hideAppSpinner();
                    this.router.navigate(['/accountinfo']);
                } else {
                    this.userService.hideAppSpinner();
                    window.scrollTo(0, 0);
                    this.submitIsDisabled = false;
                    this.userService.showflashMessage('danger', response.raw.message);
                }
            });
        }
    }

}
