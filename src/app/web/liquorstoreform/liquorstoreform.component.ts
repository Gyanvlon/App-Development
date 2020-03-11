import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
@Component({
    selector: 'app-liquorstoreform',
    templateUrl: './liquorstoreform.component.html',
    styleUrls: ['./liquorstoreform.component.css']
})
export class LiquorStoreForm implements OnInit {
    liqoureStoreSignup: FormGroup;
    userDeliveryAddressToUse = {};
    formSubmitted: boolean;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private ProviderServiceService: ProviderServiceService
    ) { this.initForm(); }

    ngOnInit() {
        this.userService.setCustomJsToFormData(); // to set custom js to form data
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
        } else {
            this.userService.setIsLocation(true);
        }
    }

    initForm() {
        this.liqoureStoreSignup = this.fb.group({
            firstname: ['', [Validators.required]],
            lastname: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
            storename: ['', [Validators.required]],
            zipcode: ['', [Validators.required]],
            state: ['', [Validators.required]]
        });
    }

    get firstname() { return this.liqoureStoreSignup.get('firstname'); }

    get lastname() { return this.liqoureStoreSignup.get('lastname'); }

    get email() { return this.liqoureStoreSignup.get('email'); }

    get phoneNumber() { return this.liqoureStoreSignup.get('phoneNumber'); }

    get storename() { return this.liqoureStoreSignup.get('storename'); }

    get zipcode() { return this.liqoureStoreSignup.get('zipcode'); }

    get state() { return this.liqoureStoreSignup.get('state'); }

    onSubmit() {
        if (!this.liqoureStoreSignup.valid) {
            this.formSubmitted = true;
            return;
        }
        this.formSubmitted = false;
        let userData = {
            userType: 'liquorStore',
            firstname: this.liqoureStoreSignup.get('firstname').value,
            lastname: this.liqoureStoreSignup.get('lastname').value,
            email: this.liqoureStoreSignup.get('email').value,
            phoneNumber: this.liqoureStoreSignup.get('phoneNumber').value,
            storename: this.liqoureStoreSignup.get('storename').value,
            zipcode: this.liqoureStoreSignup.get('zipcode').value,
            state: this.liqoureStoreSignup.get('state').value
        };
        this.ProviderServiceService.subscribeToNewsLetter(userData)
            .subscribe(data => {
                this.userService.showflashMessage('success', 'We have received your request. Will get back to you soon.');
                this.liqoureStoreSignup.reset();
                this.liqoureStoreSignup.controls['phoneNumber'].setValue("");
            });
    }
}
