import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { ProviderServiceService } from "../../../app/shared/services/provider-service.service";

@Component({
    selector: 'app-forgotpassword',
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
    forgotpasswordForm: FormGroup;
    formSubmitted: boolean;

    constructor(
        private fb: FormBuilder,
        private ProviderServiceService: ProviderServiceService,
        private router: Router,
        private userService: UserService
    ) {
        this.initForm();
    }
    ngOnInit() {
        this.userService.setCustomJsToFormData();//to set custom js to form data
    }

    initForm() {
        this.forgotpasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.minLength(5)]]
        });
    }
    get email() { return this.forgotpasswordForm.get('email'); }
    public onForgotPassword() {
        if (!this.forgotpasswordForm.valid) {
            this.formSubmitted = true;
            return;
        }
        this.formSubmitted = false;
        this.userService.showAppSpinner();
        let userEmail = this.forgotpasswordForm.get('email').value;
        this.ProviderServiceService.sendForgotPasswordRequest(userEmail)
            .subscribe(data => {
                window.scrollTo(0, 0);
                if (data.message == "Email Sent") {
                    this.userService.showflashMessage("success", "We have sent you an email to reset your password. This may take a few minutes.");
                    this.userService.hideAppSpinner();
                } else if (data.error) {
                    this.userService.showflashMessage("danger", data.error.message);
                    this.userService.hideAppSpinner();
                }
            },
                error => {
                    window.scrollTo(0, 0);
                    this.userService.showflashMessage("danger", JSON.parse(error._body).error.message);
                    this.userService.hideAppSpinner();
                });
    }
}
