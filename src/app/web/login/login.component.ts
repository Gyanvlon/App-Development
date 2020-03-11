import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from 'angular4-social-login';
import { FacebookLoginProvider, SocialUser } from 'angular4-social-login';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import * as $ from 'jquery';
import * as moment from 'moment';
import { Angulartics2 } from 'angulartics2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    public userCurrentLocation: any = {};
    loginForm: FormGroup;
    signupForm: FormGroup;
    isBusiness: boolean = false;
    public currentDate: Date = new Date();
    public currentYear: number = this.currentDate.getFullYear();
    public loggedIn: boolean;
    public isAgeVerify: boolean = false;
    public isAcceptPolicies: boolean = false;
    public userDeliveryAddressToUse = {};
    public formSubmitAttempt: boolean = false;
    public formLoginAttempt: boolean = false;

    constructor(
        private fb: FormBuilder,
        private ProviderServiceService: ProviderServiceService,
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private angulartics2: Angulartics2
    ) {
        this.initForm();
    }

    ngOnInit() {
        this.userService.showAppSpinner();
        this.isBusiness = false;
        if (this.userService.isLoggedIn()) {
            this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
                .subscribe(data => {
                    this.userService.setCurrentUserData(data);
                    this.ProviderServiceService.getShoppingCart()
                        .subscribe(data => {
                            this.userService.setShoppingCartData(data);
                            this.ProviderServiceService.getShoppingCartCount()
                                .subscribe(data => {
                                    this.userService.setShoppingCartCount(data.count);
                                    this.ProviderServiceService.getUserOrders()
                                        .subscribe(data => {
                                            this.userService.setUserOrders(data);
                                            this.ProviderServiceService.getuserDeliveryLocation()
                                                .subscribe(data => {
                                                    this.authService.signOut();
                                                    this.userService.signIn();
                                                    if (data.length > 0) {
                                                        this.userService.setuserDeliveryLocation(data);
                                                        this.userService.setuserDeliveryLocationToUse(data[0])
                                                    }
                                                    this.userService.setHeaderCartCheck(true);
                                                    this.userService.setProductToRateCheck('true');
                                                    this.userService.hideAppSpinner();
                                                    this.router.navigate(['/productlisting']);
                                                });
                                        });
                                });
                        });
                }, error => {
                    if (error.message == 'Authorization Required' || error.message == 'Invalid Access Token' || error.statusText == 'Unauthorized') {
                        this.userService.setLoginPopupCheck('true');
                    }
                    this.userService.hideAppSpinner();
                });
        } else {
            this.userService.hideAppSpinner();
        }
        this.authService.authState.subscribe((user) => {
            if (user !== null) {
                this.userService.showAppSpinner();
                this.authService.signOut();
                this.ProviderServiceService.checkSocialCredential(user.id)
                    .subscribe(data => {
                        if (data.length == 0) {
                            window.navigator.geolocation.getCurrentPosition(
                                position => {
                                    let estDataIds = this.userService.getCurrentEstablishmentId();
                                    let signupData = {
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        displayName: user.name,
                                        username: user.name,
                                        birthday: '',
                                        ageRange: (user.age_range_max) ? user.age_range_max : user.age_range_min,
                                        location: {
                                            lat: position.coords.latitude, // 40.682570
                                            lng: position.coords.longitude // -73.930284
                                        },
                                        email: user.email,
                                        password: 'bevviapp',
                                        establishmentId: estDataIds != null ? estDataIds.establishmentId : '',
                                        otherEstablishmentId: estDataIds != null ? estDataIds.otherEstablishmentId : ''
                                    };

                                    this.ProviderServiceService.signup(signupData)
                                        .subscribe(data => {
                                            this.ProviderServiceService.createSocialCredential(user.id, data.id)
                                                .subscribe(data => {
                                                    this.ProviderServiceService.login({ 'email': user.email, 'password': 'bevviapp' })
                                                        .subscribe(data => {
                                                            this.angulartics2.eventTrack.next({
                                                                action: 'Complete Registration',
                                                                properties: {
                                                                    category: 'Complete Registration',
                                                                    label: 'action',
                                                                    value: 'User has Completed Registration',
                                                                    accountId: data.userId
                                                                },
                                                            });
                                                            this.angulartics2.eventTrack.next({
                                                                action: 'Login',
                                                                properties: {
                                                                    category: 'Login',
                                                                    label: 'action',
                                                                    value: 'User completed Login',
                                                                    accountId: data.userId
                                                                },
                                                            });
                                                            this.userService.setAccessToken(data.id);
                                                            this.userService.setCurrentAccountId(data.userId);
                                                            this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
                                                                .subscribe(data => {
                                                                    this.userService.setCurrentUserData(data);
                                                                    this.ProviderServiceService.uploadCartItemFromLocalStorage().subscribe(dataCart => {
                                                                        let add = (this.userService.getuserDeliveryLocationToUse());
                                                                        let lati = (add == null ? 0 : add.geoLocation.coordinates[1]);
                                                                        let long = (add == null ? 0 : add.geoLocation.coordinates[0]);
                                                                        let ref_address = (add == null ? '' : add.address);
                                                                        this.ProviderServiceService.addLocation(lati, long)
                                                                            .subscribe(data => {
                                                                                this.ProviderServiceService.addUserDeliveryLocation(lati, long, ref_address, data['id'])
                                                                                    .subscribe(data => {
                                                                                        this.ProviderServiceService.getShoppingCart()
                                                                                            .subscribe(data => {
                                                                                                this.userService.setShoppingCartData(data);
                                                                                                this.ProviderServiceService.getShoppingCartCount()
                                                                                                    .subscribe(data => {
                                                                                                        this.userService.setShoppingCartCount(data.count);
                                                                                                        this.ProviderServiceService.getuserDeliveryLocation()
                                                                                                            .subscribe(data => {
                                                                                                                if (data.length > 0) {
                                                                                                                    this.userService.setuserDeliveryLocation(data);//edited
                                                                                                                    this.userService.setuserDeliveryLocationToUse(data[0])
                                                                                                                }
                                                                                                                this.ProviderServiceService.getUserOrders()
                                                                                                                    .subscribe(data => {
                                                                                                                        this.userService.setUserOrders(data);
                                                                                                                        this.ProviderServiceService.getUserSavedCards((data) => {
                                                                                                                            this.userService.signIn();
                                                                                                                            this.userService.setHeaderCartCheck(true);
                                                                                                                            this.userService.setProductToRateCheck('true');
                                                                                                                            this.userService.hideAppSpinner();
                                                                                                                            this.router.navigate(['/productlisting']);
                                                                                                                        });
                                                                                                                    });

                                                                                                            });
                                                                                                    });
                                                                                            });
                                                                                    });
                                                                            });

                                                                    });
                                                                }, error => {
                                                                    this.authService.signOut();
                                                                    if (error.statusText == 'Unauthorized') {
                                                                        this.userService.setLoginPopupCheck('true');
                                                                    }
                                                                    this.userService.hideAppSpinner();
                                                                });
                                                        }, error => {
                                                            window.scrollTo(0, 0);
                                                            this.authService.signOut();
                                                            this.userService.showflashMessage('danger', 'Invalid Credentials. Please check and try again');
                                                            this.userService.unsetAccessToken();
                                                            this.userService.unsetCurrentAccountId();
                                                            this.userService.unsetCurrentUserData();
                                                            this.userService.hideAppSpinner();
                                                        });
                                                });
                                        }, error => {
                                            window.scrollTo(0, 0);
                                            let errorBody = JSON.parse(error._body);
                                            if (errorBody.error.details.messages.email && errorBody.error.details.messages.email[0] == 'Email already exists') {
                                                this.userService.showflashMessage('danger', 'Account is already created with Email signup. Please login using your email and password.');
                                            } else if (errorBody.error.details.messages.username) {
                                                this.userService.showflashMessage('danger', errorBody.error.details.messages.username[0]);
                                            } else {
                                                this.userService.showflashMessage('danger', 'Some error occured. Please try again');
                                            }
                                            this.userService.unsetAccessToken();
                                            this.userService.unsetCurrentAccountId();
                                            this.userService.unsetCurrentUserData();
                                            this.userService.hideAppSpinner();
                                        });
                                }, error => {
                                    let estDataIds = this.userService.getCurrentEstablishmentId();
                                    let signupData = {
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        displayName: user.name,
                                        username: user.name,
                                        birthday: '',
                                        ageRange: (user.age_range_max) ? user.age_range_max : user.age_range_min,
                                        location: {
                                            lat: 40.682570,
                                            lng: -73.930284
                                        },
                                        email: user.email,
                                        password: 'bevviapp',
                                        establishmentId: estDataIds != null ? estDataIds.establishmentId : '',
                                        otherEstablishmentId: estDataIds != null ? estDataIds.otherEstablishmentId : ''
                                    };

                                    this.ProviderServiceService.signup(signupData)
                                        .subscribe(data => {
                                            this.ProviderServiceService.createSocialCredential(user.id, data.id)
                                                .subscribe(data => {
                                                    this.ProviderServiceService.login({ 'email': user.email, 'password': 'bevviapp' })
                                                        .subscribe(data => {
                                                            this.angulartics2.eventTrack.next({
                                                                action: 'Complete Registration',
                                                                properties: {
                                                                    category: 'Complete Registration',
                                                                    label: 'action',
                                                                    value: 'User has Completed Registration',
                                                                    accountId: data.userId
                                                                },
                                                            });
                                                            this.angulartics2.eventTrack.next({
                                                                action: 'Login',
                                                                properties: {
                                                                    category: 'Login',
                                                                    label: 'action',
                                                                    value: 'User completed Login',
                                                                    accountId: data.userId
                                                                },
                                                            });
                                                            this.userService.setAccessToken(data.id);
                                                            this.userService.setCurrentAccountId(data.userId);
                                                            this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
                                                                .subscribe(data => {
                                                                    this.userService.setCurrentUserData(data);
                                                                    this.ProviderServiceService.uploadCartItemFromLocalStorage().subscribe(dataCart => {
                                                                        let add = (this.userService.getuserDeliveryLocationToUse());
                                                                        let lati = (add == null ? 0 : add.geoLocation.coordinates[1]);
                                                                        let long = (add == null ? 0 : add.geoLocation.coordinates[0]);
                                                                        let ref_address = (add == null ? '' : add.address);
                                                                        this.ProviderServiceService.addLocation(lati, long)
                                                                            .subscribe(data => {
                                                                                this.ProviderServiceService.addUserDeliveryLocation(lati, long, ref_address, data['id'])
                                                                                    .subscribe(data => {
                                                                                        this.ProviderServiceService.getShoppingCart()
                                                                                            .subscribe(data => {
                                                                                                this.userService.setShoppingCartData(data);
                                                                                                this.ProviderServiceService.getShoppingCartCount()
                                                                                                    .subscribe(data => {
                                                                                                        this.userService.setShoppingCartCount(data.count);
                                                                                                        this.ProviderServiceService.getuserDeliveryLocation()
                                                                                                            .subscribe(data => {
                                                                                                                if (data.length > 0) {
                                                                                                                    this.userService.setuserDeliveryLocation(data);//edited
                                                                                                                    this.userService.setuserDeliveryLocationToUse(data[0])
                                                                                                                }
                                                                                                                this.ProviderServiceService.getUserOrders()
                                                                                                                    .subscribe(data => {
                                                                                                                        this.userService.setUserOrders(data);
                                                                                                                        this.ProviderServiceService.getUserSavedCards((data) => {
                                                                                                                            this.userService.signIn();
                                                                                                                            this.userService.setHeaderCartCheck(true);
                                                                                                                            this.userService.setProductToRateCheck('true');
                                                                                                                            this.userService.hideAppSpinner();
                                                                                                                            this.router.navigate(['/productlisting']);
                                                                                                                        });
                                                                                                                    });

                                                                                                            });
                                                                                                    });
                                                                                            });
                                                                                    });
                                                                            });

                                                                    });
                                                                }, error => {
                                                                    this.authService.signOut();
                                                                    if (error.statusText == 'Unauthorized') {
                                                                        this.userService.setLoginPopupCheck('true');
                                                                    }
                                                                    this.userService.hideAppSpinner();
                                                                });
                                                        }, error => {
                                                            window.scrollTo(0, 0);
                                                            this.authService.signOut();
                                                            this.userService.showflashMessage('danger', 'Invalid Credentials. Please check and try again');
                                                            this.userService.unsetAccessToken();
                                                            this.userService.unsetCurrentAccountId();
                                                            this.userService.unsetCurrentUserData();
                                                            this.userService.hideAppSpinner();
                                                        });
                                                });
                                        }, error => {
                                            window.scrollTo(0, 0);
                                            let errorBody = JSON.parse(error._body);
                                            if (errorBody.error.details.messages.email && errorBody.error.details.messages.email[0] == 'Email already exists') {
                                                this.userService.showflashMessage('danger', 'Account is already created with Email signup. Please login using your email and password.');
                                            } else if (errorBody.error.details.messages.username) {
                                                this.userService.showflashMessage('danger', errorBody.error.details.messages.username[0]);
                                            } else {
                                                this.userService.showflashMessage('danger', 'Some error occured. Please try again');
                                            }
                                            this.userService.unsetAccessToken();
                                            this.userService.unsetCurrentAccountId();
                                            this.userService.unsetCurrentUserData();
                                            this.userService.hideAppSpinner();
                                        });
                                });
                        } else {
                            this.ProviderServiceService.login({ 'email': user.email, 'password': 'bevviapp' })
                                .subscribe(data => {
                                    this.userService.setAccessToken(data.id);
                                    this.userService.setCurrentAccountId(data.userId);
                                    this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
                                        .subscribe(data => {
                                            this.userService.setCurrentUserData(data);
                                            this.ProviderServiceService.uploadCartItemFromLocalStorage().subscribe(dataCart => {
                                                let add = (this.userService.getuserDeliveryLocationToUse());
                                                let lati = (add == null ? 0 : add.geoLocation.coordinates[1]);
                                                let long = (add == null ? 0 : add.geoLocation.coordinates[0]);
                                                let ref_address = (add == null ? '' : add.address);
                                                this.ProviderServiceService.addLocation(lati, long)
                                                    .subscribe(data => {
                                                        this.ProviderServiceService.addUserDeliveryLocation(lati, long, ref_address, data['id'])
                                                            .subscribe(data => {
                                                                this.ProviderServiceService.getShoppingCart()
                                                                    .subscribe(data => {
                                                                        this.angulartics2.eventTrack.next({
                                                                            action: 'Login',
                                                                            properties: {
                                                                                category: 'Login',
                                                                                label: 'action',
                                                                                value: 'User completed Login',
                                                                                accountId: this.userService.getCurrentAccountId()
                                                                            },
                                                                        });
                                                                        this.userService.setShoppingCartData(data);
                                                                        this.ProviderServiceService.getShoppingCartCount()
                                                                            .subscribe(data => {
                                                                                this.userService.setShoppingCartCount(data.count);
                                                                                this.ProviderServiceService.getUserOrders()
                                                                                    .subscribe(data => {
                                                                                        this.userService.setUserOrders(data);
                                                                                        this.ProviderServiceService.getuserDeliveryLocation()
                                                                                            .subscribe(data => {
                                                                                                if (data.length > 0) {
                                                                                                    this.userService.signIn();
                                                                                                    this.authService.signOut();
                                                                                                    this.userService.setuserDeliveryLocation(data);
                                                                                                    this.userService.setuserDeliveryLocationToUse(data[0]);
                                                                                                    this.userService.setHeaderCartCheck(true);
                                                                                                    this.userService.setProductToRateCheck('true');
                                                                                                    this.userService.hideAppSpinner();
                                                                                                    this.router.navigate(['/productlisting']);
                                                                                                } else {
                                                                                                    this.router.navigate(['/']);
                                                                                                }
                                                                                            });
                                                                                    });
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            });
                                        }, error => {
                                            if (error.statusText == 'Unauthorized') {
                                                this.userService.setLoginPopupCheck('true');
                                            }
                                            this.userService.hideAppSpinner();
                                        });
                                }, error => {
                                    window.scrollTo(0, 0);
                                    this.userService.showflashMessage('danger', 'Invalid Credentials. Please check and try again');
                                    this.userService.unsetAccessToken();
                                    this.userService.unsetCurrentAccountId();
                                    this.userService.unsetCurrentUserData();
                                    this.userService.hideAppSpinner();
                                });
                        }
                    });
            }
        });
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
        } else {
            this.userService.setIsLocation(true);
        }
        this.userService.setCustomJsToFormData(); // to set custom js to form data
    }
    businessRadioClicked(e) {
        this.isBusiness = !this.isBusiness;
        const companyName = this.signupForm.get('companyname');
        const companyAddress = this.signupForm.get('companyaddress');
        if (this.isBusiness) {
            companyName.setValidators([Validators.required]);
            companyAddress.setValidators([Validators.required]);
        } else if (!this.isBusiness) {
            companyName.setValue('');
            companyAddress.setValue('');
            companyName.setValidators(null);
            companyAddress.setValidators(null);
        }
        companyName.updateValueAndValidity();
        companyAddress.updateValueAndValidity();
    }

    initForm() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.signupForm = this.fb.group({
            username: ['', [Validators.required]],
            lastname: ['', [Validators.required]],
            companyname: ['',],
            companyaddress: ['',],
            s_email: ['', [Validators.required, Validators.email]],
            s_password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', [Validators.required]],
            code: [''],
            date: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
            month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
            year: ['', [Validators.required, Validators.min(1800), Validators.max(this.currentYear - 21)]],
            acceptPolicies: ['', [Validators.required]]
        }, { validator: this.userService.checkIfMatchingPasswords('s_password', 'confirm_password') })
    }

    get email() { return this.loginForm.get('email'); }

    get password() { return this.loginForm.get('password'); }

    get s_email() { return this.signupForm.get('s_email'); }

    get username() { return this.signupForm.get('username'); }

    get lastname() { return this.signupForm.get('lastname'); }

    get companyname() { return this.signupForm.get('companyname'); }

    get companyaddress() { return this.signupForm.get('companyaddress'); }

    get s_password() { return this.signupForm.get('s_password'); }

    get confirm_password() { return this.signupForm.get('confirm_password'); }

    get phoneNumber() { return this.signupForm.get('phoneNumber'); }

    get code() { return this.signupForm.get('code'); }

    get date() { return this.signupForm.get('date'); }

    get month() { return this.signupForm.get('month'); }

    get year() { return this.signupForm.get('year'); }

    get acceptPolicies() { return this.signupForm.get('acceptPolicies'); }

    get ageVerify() { return this.signupForm.get('ageVerify'); }

    onLogin() {
        if (!this.loginForm.valid) {
            this.formLoginAttempt = true;
            this.formSubmitAttempt = false;
            return;
        }
        this.formLoginAttempt = false;
        this.formSubmitAttempt = false;
        this.applyLogin(this.loginForm.get('email').value, this.loginForm.get('password').value);
    }
    applyLogin(userEmail, userPassword) {
        this.userService.showAppSpinner();
        this.ProviderServiceService.emailLogin(userEmail, userPassword)
            .subscribe(data => {
                this.userService.setAccessToken(data[0].id);
                this.userService.setCurrentAccountId(data[0].userId);
                this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
                    .subscribe(data => {
                        this.userService.setCurrentUserData(data);
                        this.ProviderServiceService.uploadCartItemFromLocalStorage().subscribe(dataCart => {
                            let add = (this.userService.getuserDeliveryLocationToUse());
                            let lati = (add == null ? 0 : add.geoLocation.coordinates[1]);
                            let long = (add == null ? 0 : add.geoLocation.coordinates[0]);
                            let ref_address = (add == null ? '' : add.address);
                            this.ProviderServiceService.addLocation(lati, long)
                                .subscribe(data => {
                                    this.ProviderServiceService.addUserDeliveryLocation(lati, long, ref_address, data['id'])
                                        .subscribe(data => {
                                            this.ProviderServiceService.getShoppingCart()
                                                .subscribe(data => {
                                                    this.loginForm.reset();
                                                    this.angulartics2.eventTrack.next({
                                                        action: 'Login',
                                                        properties: {
                                                            category: 'Login',
                                                            label: 'action',
                                                            value: 'User completed Login',
                                                            accountId: this.userService.getCurrentAccountId()
                                                        },
                                                    });
                                                    this.userService.unsetCartLocalStorage();
                                                    this.userService.setShoppingCartData(data);
                                                    this.ProviderServiceService.getShoppingCartCount()
                                                        .subscribe(data => {
                                                            this.userService.setShoppingCartCount(data.count);
                                                            this.ProviderServiceService.getUserOrders()
                                                                .subscribe(data => {
                                                                    this.userService.setUserOrders(data);
                                                                    this.ProviderServiceService.getuserDeliveryLocation()
                                                                        .subscribe(data => {
                                                                            if (data.length > 0) {
                                                                                this.userService.signIn();
                                                                                this.userService.setuserDeliveryLocation(data);
                                                                                this.userService.setuserDeliveryLocationToUse(data[0]);
                                                                                this.userService.setHeaderCartCheck(true);
                                                                                this.userService.setProductToRateCheck('true');
                                                                                this.userService.hideAppSpinner();
                                                                                this.userService.setSearchTerm('');
                                                                                this.userService.setSearchText('');
                                                                                this.router.navigate(['/productlisting']);
                                                                            } else {
                                                                                this.router.navigate(['/']);
                                                                            }
                                                                        });
                                                                });
                                                        });
                                                });
                                        })
                                });

                        });
                    }, error => {
                        if (error.message == 'Authorization Required' || error.message == 'Invalid Access Token' || error.statusText == 'Unauthorized') {
                            this.userService.setLoginPopupCheck('true');
                        }
                        this.userService.hideAppSpinner();
                    });
            }, error => {
                window.scrollTo(0, 0);
                this.userService.showflashMessage('danger', JSON.parse(error._body).error.message);
                this.userService.unsetAccessToken();
                this.userService.unsetCurrentAccountId();
                this.userService.unsetCurrentUserData();
                this.userService.hideAppSpinner();
            });
    }

    setLocationToDB() { }

    onSignup(): any {
        if (!this.signupForm.valid || !this.isAcceptPolicies) {
            this.formSubmitAttempt = true;
            this.formLoginAttempt = false;
            return;
        }
        this.formSubmitAttempt = false;
        this.formLoginAttempt = false;
        this.userService.showAppSpinner();
        window.navigator.geolocation.getCurrentPosition(
            position => {
                let estDataIds = this.userService.getCurrentEstablishmentId();
                let signupData = {
                    firstName: this.signupForm.get('username').value,
                    lastName: this.signupForm.get('lastname').value,
                    companyName: this.signupForm.get('companyname').value,
                    address: this.signupForm.get('companyaddress').value,
                    username: this.signupForm.get('username').value,
                    birthday: moment(this.signupForm.controls.month.value + '-' + this.signupForm.controls.date.value + '-' + this.signupForm.controls.year.value, 'MM-DD-YYYY').format('YYYY-MM-DD'),
                    ageRange: moment().diff(moment(this.signupForm.controls.month.value + '-' + this.signupForm.controls.date.value + '-' + this.signupForm.controls.year.value, 'MM-DD-YYYY').format('YYYY-MM-DD'), 'years'),
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    email: this.signupForm.get('s_email').value,
                    password: this.signupForm.get('s_password').value,
                    refCode: this.signupForm.get('code').value,
                    establishmentId: estDataIds != null ? estDataIds.establishmentId : '',
                    otherEstablishmentId: estDataIds != null ? estDataIds.otherEstablishmentId : ''

                };
                this.ProviderServiceService.signup(signupData)
                    .subscribe(data => {
                        window.scrollTo(0, 0);                        
                        this.applyLogin(this.signupForm.get('s_email').value, this.signupForm.get('s_password').value);
                        this.signupForm.reset();
                        this.userService.showflashMessage('success', 'Signup Successfull. Please wait while we log you in ');

                        this.userService.hideAppSpinner();
                    }, error => {
                        window.scrollTo(0, 0);
                        let errorBody = JSON.parse(error._body);
                        if (errorBody.error.details.messages.email && errorBody.error.details.messages.email[0] == 'Email already exists') {
                            this.userService.showflashMessage('danger', 'Account is already created with Email signup. Please login using your email and password.');
                        } else if (errorBody.error.details.messages.username) {
                            this.userService.showflashMessage('danger', errorBody.error.details.messages.username[0]);
                        } else {
                            this.userService.showflashMessage('danger', 'Some error occured. Please try again');
                        }
                        this.userService.unsetAccessToken();
                        this.userService.unsetCurrentAccountId();
                        this.userService.unsetCurrentUserData();
                        this.userService.hideAppSpinner();
                    });
            }, error => {
                let estDataIds = this.userService.getCurrentEstablishmentId();
                let signupData = {
                    firstName: this.signupForm.get('username').value,
                    lastName: this.signupForm.get('lastname').value,
                    companyName: this.signupForm.get('companyname').value,
                    address: this.signupForm.get('companyaddress').value,
                    username: this.signupForm.get('username').value,

                    birthday: moment(this.signupForm.controls.month.value + '-' + this.signupForm.controls.date.value + '-' + this.signupForm.controls.year.value, 'MM-DD-YYYY').format('YYYY-MM-DD'),
                    ageRange: moment().diff(moment(this.signupForm.controls.month.value + '-' + this.signupForm.controls.date.value + '-' + this.signupForm.controls.year.value, 'MM-DD-YYYY').format('YYYY-MM-DD'), 'years'),
                    location: {
                        lat: 40.682570,
                        lng: -73.930284
                    },
                    email: this.signupForm.get('s_email').value,
                    password: this.signupForm.get('s_password').value,
                    establishmentId: estDataIds != null ? estDataIds.establishmentId : '',
                    otherEstablishmentId: estDataIds != null ? estDataIds.otherEstablishmentId : ''
                };
                this.ProviderServiceService.signup(signupData)
                    .subscribe(data => {
                        window.scrollTo(0, 0);                       
                        this.applyLogin(this.signupForm.get('s_email').value, this.signupForm.get('s_password').value);
                        this.signupForm.reset();
                        this.userService.showflashMessage('success', 'Signup Successfull. Please wait while we log you in');
                        this.userService.hideAppSpinner();
                    }, error => {
                        window.scrollTo(0, 0);
                        let errorBody = JSON.parse(error._body);
                        if (errorBody.error.details.messages.email && errorBody.error.details.messages.email[0] == 'Email already exists') {
                            this.userService.showflashMessage('danger', 'Account is already created with Email signup. Please login using your email and password.');
                        } else if (errorBody.error.details.messages.username) {
                            this.userService.showflashMessage('danger', errorBody.error.details.messages.username[0]);
                        } else {
                            this.userService.showflashMessage('danger', 'Some error occured. Please try again');
                        }
                        this.userService.unsetAccessToken();
                        this.userService.unsetCurrentAccountId();
                        this.userService.unsetCurrentUserData();
                        this.userService.hideAppSpinner();
                    });
            }
        );
    }
    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

}
