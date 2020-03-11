import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../shared/services/user.service';
import { ProviderServiceService } from './../../shared/services/provider-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['../login/login.component.css', './reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    public accessToken: string = "";
    public accountId: string = "";
    passwordform: FormGroup;
    public formSubmitAttempt: boolean = false;

    constructor(
        private providerServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder
    ) {
        this.initForm();
    }

    initForm() {
        this.passwordform = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', [Validators.required]],
        }, { validator: this.userService.checkIfMatchingPasswords('password', 'confirm_password') })
    }

    get password() { return this.passwordform.get('password'); }

    get confirm_password() { return this.passwordform.get('confirm_password'); }

    ngOnInit() {
        this.userService.setCustomJsToFormData();//to set custom js to form data
        if (this.userService.isLoggedIn()) {
            this.router.navigate(['/']);
        } else {
            this.route.params
                .subscribe(params => {
                    this.accessToken = params.accessToken;
                    this.accountId = params.accountId;
                });
        }
    }

    onPasswordReset() {
        if (!this.passwordform.valid) {
            this.formSubmitAttempt = true;
            return;
        }
        this.formSubmitAttempt = false;
        this.userService.showAppSpinner();
        this.providerServiceService.reset_password(this.passwordform.get('password').value, this.accountId, this.accessToken)
            .subscribe(data => {
                window.scrollTo(0, 0);
                this.userService.showflashMessage("success", "Password Reset successfully. You will be redirected to the login screen");
                setTimeout(() => {
                    this.userService.hideAppSpinner();
                    this.router.navigate(['/login']);
                }, 6000);
            }, error => {
                if (error.message == "Authorization Required" || error.message == "Invalid Access Token" || error.statusText == "Unauthorized") {
                    this.userService.setLoginPopupCheck('true');
                }
                window.scrollTo(0, 0);
                this.userService.showflashMessage("danger", "Error occured. Please try again");
                this.userService.hideAppSpinner();
            });
    }

}
