import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { ProviderServiceService } from '../shared/services/provider-service.service';
import { Angulartics2 } from 'angulartics2';
import { BRANCH_LINK } from '../constants/constants';
import { DynamicScriptLoaderService } from '../shared/services/DynamicScriptLoader';
declare var jQuery: any;

@Component({
    selector: 'app-frontend',
    templateUrl: './frontend.component.html',
    styleUrls: ['./frontend.component.css']
})
export class FrontendComponent implements OnInit {

    public isUserLoggedIn: boolean = false;
    public loggedInUserData: Array<any> = [];
    public cartItems: Array<any> = [];
    public noShowFooterPages: Array<string> = [];
    public noShowFooterBottom: boolean = false;
    public currentActivePage: string = this.router.url;
    public productsToRate: Array<any> = [];
    public footerClass: string = (this.router.url == '/') ? 'stickyFooter' : '';
    public userDeliveryAddressToUse: Object = {};
    public branchLink: string = BRANCH_LINK;
    public isIndexPage: boolean = false;
    public isLoginPage: boolean = false;
    public isLocationEntered: boolean = false;
    public isNotLoggedInPages: boolean = false;
    public currentModule: string = '';
    public headerDisabledPages: Array<string> = ['forgotpassword', 'reset-password', 'help', 'liquorstoreform', 'termsOfUse', 'privacyPolicy'];
    public setLogoAndCartHidden: boolean = false;
    public searchValue: string = '';

    newsletterSubscribe: FormGroup;

    public carouselOptions: any = {
        items: 2,
        dots: false,
        nav: true,
        navText: ['<i class=\'fa fa fa-angle-left\' aria-hidden=\'true\'></i>', '<i class=\'fa fa fa-angle-right\' aria-hidden=\'true\'></i>']
    }

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private router: Router,
        private ProviderServiceService: ProviderServiceService,
        private dynamicScriptLoader: DynamicScriptLoaderService,
        private angulartics2: Angulartics2
    ) { this.initForm(); }

    ngOnInit() {
        this.loadScripts();
        this.router.events.subscribe((evt) => {
            this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
            if (this.userDeliveryAddressToUse != {}) {
                this.isLocationEntered = true;
            } else {
                this.isLocationEntered = false;
            }
            let route_name = this.router.url.split('/');

            this.isUserLoggedIn = this.userService.isLoggedIn();
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            if (route_name[1] == '') {
                this.isIndexPage = true;
            } else {
                this.isIndexPage = false;
            }

            if (route_name[1] == 'login') {
                this.isLoginPage = true;
            } else {
                this.isLoginPage = false;
            }
            if ($.inArray(this.router.url.split('/')[1], this.headerDisabledPages) > -1) {
                this.isNotLoggedInPages = true;
            } else {
                this.isNotLoggedInPages = false;
            }          
            if (route_name[1] == 'accountinfo') {
                setTimeout(function () {
                }, 1000);
            } else if (this.router.url.split('/')[1] == '' && !this.userService.isLoggedIn()) {
                            }
        });
        this.currentModule = this.router.url.split('/')[1];
        let route_name = this.router.url.split('/');        
        if (route_name[1] == '') {
            this.isIndexPage = true;
        } else {
            this.isIndexPage = false;
        }
        if (route_name[1] == 'login') {
            this.isLoginPage = true;
        } else {
            this.isLoginPage = false;
        }
        if ($.inArray(this.router.url.split('/')[1], this.headerDisabledPages) > -1) {
            this.isNotLoggedInPages = true;
        } else {
            this.isNotLoggedInPages = false;
        }      
        if (this.router.url.split('/')[1] == 'accountinfo') {
            setTimeout(function () {
            }, 1000);
        } else if (this.router.url.split('/')[1] == '' && !this.userService.isLoggedIn()) {
           
        }
       
        setInterval(() => {
            $(window).scroll(function () {
                if ($(document).scrollTop() == 0) {
                    $('.header-container').removeClass('sticky');
                } else {
                    $('.header-container').addClass('sticky');
                }
            });
        }, 500);

        setInterval(() => {
            let smartbannerHeight = 0;
            let headerContainerHeight = $('.navbar').height();
            if ($('.smartbanner').css('display') != 'none') {
                smartbannerHeight = $('.smartbanner').height();
            }
            $('.custom-margin-div').css({ 'margin-top': headerContainerHeight + 'px' });
            $('.navbar').css({ top: smartbannerHeight + 'px' });
        }, 500);

        setInterval(() => {
            if (this.userService.getLoginPopupCheck() == 'true') {
                // $("#openLogoutPopup").trigger("click");
                $('.modal .close').trigger('click');
                this.doForceLogout();
                this.userService.setLoginPopupCheck('false');
            }

            if (this.userService.getAddCardCheck() == 'true') {
                this.userService.setAddCardCheck('false');
                console.log('I came');
                $('.modal .close').trigger('click');
                setTimeout(function () {
                    document.getElementById('addcard').click();
                }, 100);
            }
        }, 1500);      

        setInterval(() => {
            if ($('.numberoforder').html() == '0') {
                $('.numberoforder').addClass('hidden');
            } else {
                $('.numberoforder').removeClass('hidden');
            }
        }, 200);
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        this.loggedInUserData = (this.isUserLoggedIn) ? this.userService.getCurrentUserData() : [];
        this.isUserLoggedIn = this.userService.isLoggedIn();
        if (this.isUserLoggedIn) {
            if ($.inArray(this.router.url.split('/')[1], ['help', 'termsOfUse', 'privacyPolicy']) == -1) {
                this.ProviderServiceService.getUserProductsToRate()
                    .subscribe(data => {
                        this.productsToRate = data;
                        if (this.productsToRate.length > 0) {
                            if (this.productsToRate.length > 1) {
                                this.carouselOptions.items = 2;
                            } else {
                                this.carouselOptions.items = 1;
                            }
                            setTimeout(() => {
                                $('#openReviewPopup').trigger('click');
                            }, 1500);
                        }
                    }, error => {
                        if (error.message == 'Authorization Required' || error.message == 'Invalid Access Token' || error.statusText == 'Unauthorized') {
                            this.userService.setLoginPopupCheck('true');
                        }
                        this.userService.hideAppSpinner();
                    });
            }
        }        
        this.updateCartCountHeader();
        this.userService.cartCheck.subscribe(flag => {
            setTimeout(() => {
                this.updateCartCountHeader();
            }, 1000);
        });
        this.userService.isLocation.subscribe(updatedTitle => {
            setTimeout(() => {
                this.isLocationEntered = updatedTitle;
            }, 1);
        });
        jQuery('#datepicker').datepicker({});
    }
    private loadScripts() {
        // You can load multiple scripts by just providing the key as argument into load method of the service
        this.dynamicScriptLoader.load('jqueryUI').then(data => {
            console.log('Script Loaded Successfully');
        }).catch(error => console.log(error));
    }
    updateCartCountHeader() {
        if (this.userService.isLoggedIn()) {
            this.ProviderServiceService.getShoppingCart()
                .subscribe(data => {
                    this.userService.setShoppingCartData(data);
                    this.userService.setShoppingCartCount(data.length);
                    this.cartItems = data;
                    return;
                });
        } else {
            let cartLocalStorage = this.userService.getCartLocalStorage();
            this.cartItems = (cartLocalStorage) ? cartLocalStorage : [];
            console.log(this.cartItems)
        }
    }
    updateSearchValue() {
        if (this.searchValue == '') {
            this.userService.setSearchTerm('');
            this.userService.setSearchText('');
        }
    }

    initForm() {
        this.newsletterSubscribe = this.fb.group({
            emailSubscribe: ['', [Validators.required, Validators.email, Validators.minLength(5)]]
        });
    }

    get emailSubscribe() { return this.newsletterSubscribe.get('emailSubscribe'); }

    onSubscribe() {
        this.ProviderServiceService.subscribeToNewsLetter({ userType: 'consumer', email: this.newsletterSubscribe.get('emailSubscribe').value })
            .subscribe(data => {
                this.newsletterSubscribe.reset();
            });
    }

    doSearch(args) {
        var searchText = this.searchValue;
        if (searchText == this.userService.getSearchText()) {
            this.router.navigate(['/productlisting']);
            return;
        }
        this.userService.setSearchTerm(searchText);
        this.userService.setSearchText(searchText);
        this.router.navigate(['/productlisting']);
    }
    closeSearchClicked() {
        this.searchValue = '';
        this.userService.setSearchTerm(this.searchValue);
        this.userService.setSearchText(this.searchValue);
    }

    ngDoCheck() {
        this.currentActivePage = this.router.url;
    }

    ngAfterContentChecked() {
        this.loggedInUserData = (this.isUserLoggedIn) ? this.userService.getCurrentUserData() : []
        this.isUserLoggedIn = this.userService.isLoggedIn();
    }

    hideInviteBand() {
    }

    doSignOut() {
        this.searchValue = '';
        this.ProviderServiceService.logout()
            .subscribe(data => {
                this.userService.unsetAllData();
                this.isUserLoggedIn = this.userService.isLoggedIn();
                this.userService.setHeaderCartCheck(true);
                this.router.navigate(['/']);
            }, error => {
                if (error.message == 'Authorization Required' || error.message == 'Invalid Access Token' || error.statusText == 'Unauthorized') {
                    this.userService.setLoginPopupCheck('true');
                }
                this.userService.hideAppSpinner();
            })
    }

    public updateHeaderCart() {      
    }

    public onRatingClick(args, productId) {
        this.angulartics2.eventTrack.next({
            action: 'Rate',
            properties: {
                category: 'Rate',
                label: 'action',
                value: 'User rated the product',
                productId: productId
            },
        });
        this.ProviderServiceService.submitProductRating(args.rating, productId).subscribe();
    }

    public doForceLogout() {
        this.searchValue = '';
        this.userService.unsetAllData();
        this.userService.setHeaderCartCheck(true);
        this.router.navigate(['/login']);
    }

}
