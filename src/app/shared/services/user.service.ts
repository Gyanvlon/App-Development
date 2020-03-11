import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SECRETKEY } from '../../constants/constants';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as encrypt from "encryptjs";
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { SpinnerService } from '@chevtek/angular-spinners';
import * as moment from 'moment';
import * as $ from 'jquery';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { serializePath } from '@angular/router/src/url_tree';
import { Router, NavigationEnd } from '@angular/router';
declare var jQuery: any;

@Injectable()
export class UserService {
    getSetDate(): any {
        throw new Error("Method not implemented.");
    }
    isLocation = new BehaviorSubject(false);
    isSerachTerm = new BehaviorSubject("");
    cartCheck = new BehaviorSubject(true);
    searchText = "";
    offerLoaded = false;
    filterObject = [];
    productListing = [];
    filterlisting = [];
    allProductListing = [];
    storeState = {};
    private previousUrl: string;
    private currentUrl: string;
    isDateSetVar: boolean = false;
    setDate: any;
    constructor(
        private http: HttpClient,
        private _flashMessagesService: FlashMessagesService,
        private spinnerService: SpinnerService,
        private router: Router
    ) {
        this.currentUrl = this.router.url;
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
            };
        });
    }
    public getPreviousUrl() {
        return this.previousUrl;
    }
    setIsLocation(isLocation: boolean) {
        this.isLocation.next(isLocation);
    }
    setOfferLoaded(ev) {
        this.offerLoaded = true;
    }
    getOfferLoaded() {
        return this.offerLoaded;
    }
    setFilterObj(ev) {
        this.filterObject = ev;
    }
    getFilterObj() {
        return this.filterObject;
    }
    getFilterListing() {
        return this.filterlisting;
    }
    getProductListing() {
        return this.productListing;
    }
    getAllProductListing() {
        return this.allProductListing;
    }
    setFilterListing(ev) {
        this.filterlisting = ev;
    }
    getStoreState() {
        return this.storeState;
    }
    setStoreState(ev) {
        this.storeState = ev;
    }
    setProductListing(ev, all) {
        this.allProductListing = all;
        this.productListing = ev;
    }
    setSearchTerm(searchTerm: string) {
        setTimeout(() => {
            this.isSerachTerm.next(searchTerm);
        }, 100);
    }
    isDateset() {
        return this.isDateSetVar;
    }
    getDateSet() {
        return this.setDate;
    }
    setDateDelivery(date) {
        this.isDateSetVar = true;
        this.setDate = date;
    }
    checkUserAge(age) {
        return (fg: FormGroup): ValidationErrors => {
            let result: ValidationErrors = null;
            if (fg.get('year').valid && fg.get('month').valid && fg.get('day').valid) {
                const value: { year: string, month: string, day: string } = fg.value;
                const date = moment({ year: +value.year, month: (+value.month) - 1, day: +value.day }).startOf('day');
                if (date.isValid()) {
                    const now = moment().startOf('day');
                    const yearsDiff = date.diff(now, 'years');
                    if (yearsDiff > -age) {
                        result = {
                            'minimumAge': {
                                'requiredAge': age,
                                'actualAge': yearsDiff
                            }
                        };
                    }
                }
            }
            return result;
        };
    }
    checkIfMatchingPasswords(password: string, confirm_password: string) {
        return (group: FormGroup) => {
            let passwordInput = group.controls[password];
            let passwordConfirmationInput = group.controls[confirm_password];
            const errors = passwordConfirmationInput.errors;

            if (passwordInput.value !== passwordConfirmationInput.value) {
                let newErrors = { notEquivalent: true };
                if (errors) {
                    newErrors = Object.assign(errors, newErrors);
                }
                return passwordConfirmationInput.setErrors(newErrors);
            } else {
                if (passwordConfirmationInput.errors) {
                    delete passwordConfirmationInput.errors['notEquivalent'];
                }
                if (passwordConfirmationInput.errors && Object.keys(passwordConfirmationInput.errors).length == 0) {
                    passwordConfirmationInput.setErrors(null);
                }
                return;
            }
        }
    }
    setAccessToken(data): void { localStorage.setItem('accessToken', this.encrypt(data)); }
    unsetAccessToken(): void { localStorage.removeItem('accessToken'); }
    getAccessToken(): string { return this.decrypt(localStorage.getItem("accessToken")); }
    setSearchText(data): void { this.searchText = data; }
    unsetSearchText(): void { localStorage.removeItem('searchText'); }
    getSearchText(): string { return this.searchText }
    setCurrentEstablishmentId(data): void { localStorage.setItem('currentEstablishmentId', this.encrypt(JSON.stringify(data))); }
    unsetCurrentEstablishmentId(): void { localStorage.removeItem('currentEstablishmentId'); }
    getCurrentEstablishmentId() {
        return JSON.parse(this.decrypt(localStorage.getItem("currentEstablishmentId")));
    }
    setCartEstablishmentId(data): void { localStorage.setItem('cartEstablishmentId', this.encrypt(data)); }
    unsetCartEstablishmentId(): void { localStorage.removeItem('cartEstablishmentId'); }
    getCartEstablishmentId(): string { return this.decrypt(localStorage.getItem("cartEstablishmentId")); }
    setShoppingCartData(data): void {
        localStorage.setItem('shoppingCartData', this.encrypt(JSON.stringify(data)));
        if (data.length > 0) {
            this.setCartEstablishmentId(data[0].offer.establishmentId);
        }
    }
    unsetShoppingCartData(): void {
        localStorage.removeItem('shoppingCartData');
        this.setHeaderCartCheck(true);
    }

    getShoppingCartData(): string { return this.decrypt(localStorage.getItem("shoppingCartData")); }

    setShoppingCartCount(data): void {
        localStorage.setItem('shoppingCartCount', data);
        if (data == 0) {
            this.unsetCartEstablishmentId();
        }
    }
    getuserDeliveryLocation(): Array<any> { return JSON.parse(this.decrypt(localStorage.getItem('userDeliveryLocation'))); }
    setuserDeliveryLocation(data): void { localStorage.setItem('userDeliveryLocation', this.encrypt(JSON.stringify(data))); }
    unsetuserDeliveryLocation(): void { localStorage.removeItem('userDeliveryLocation'); }
    getuserDeliveryLocationToUse(): any { return JSON.parse(this.decrypt(localStorage.getItem('userDeliveryLocationToUse'))); }
    setuserDeliveryLocationToUse(data): void { localStorage.setItem('userDeliveryLocationToUse', this.encrypt(JSON.stringify(data))); }
    unsetuserDeliveryLocationToUse(): void { localStorage.removeItem('userDeliveryLocationToUse'); }
    getUserOrders(): string { return this.decrypt(localStorage.getItem('userOrders')); }
    setUserOrders(data): void { localStorage.setItem('userOrders', this.encrypt(JSON.stringify(data))); }
    unsetUserOrders(): void { localStorage.removeItem('userOrders'); }
    unsetShoppingCartCount(): void { localStorage.removeItem('shoppingCartCount'); }
    getShoppingCartCount(): string { return localStorage.getItem('shoppingCartCount'); }
    setCurrentAccountId(data): void { localStorage.setItem('currentAccountId', this.encrypt(data)); }
    getCurrentAccountId(): string { return this.decrypt(localStorage.getItem('currentAccountId')); }
    unsetCurrentAccountId(): void { localStorage.removeItem('currentAccountId'); }
    setCurrentUserData(data): void {
        localStorage.setItem('currentUser', this.encrypt(JSON.stringify(data)));
        if (data.paymentIds && data.paymentIds.length > 0) {
            this.setCurrentUserPayment(data.paymentIds[0].token);
        } else {
            this.unsetCurrentUserPayment();
        }
        if (data.userProfiles) {
            this.setUserTransportmode(data.userProfiles.transport);
        } else {
            this.setUserTransportmode(0);
        }
    }
    unsetCurrentUserData(): void { localStorage.removeItem('currentUser'); }
    getCurrentUserData(): Array<any> { return JSON.parse(this.decrypt(localStorage.getItem('currentUser'))); }
    setCurrentUserPayment(data): void {
        localStorage.setItem('currentUserPayment', this.encrypt(JSON.stringify(data)));
    }
    unsetCurrentUserPayment(): void { localStorage.removeItem('currentUserPayment'); }
    getCurrentUserPayment(): Array<any> { return JSON.parse(this.decrypt(localStorage.getItem('currentUserPayment'))); }
    setUserRadiusMiles(data): void {
    }
    unsetUserRadiusMiles(): void {
    }
    getUserRadiusMiles(): number { return parseFloat(this.decrypt(localStorage.getItem('userRadiusMiles'))); }

    setUserTransportmode(data): void {
        localStorage.setItem('userTransportmode', this.encrypt(JSON.stringify(data)));
    }
    unsetUserTransportmode(): void { localStorage.removeItem('userTransportmode'); }
    getUserTransportmode(): number { return parseInt(this.decrypt(localStorage.getItem('userTransportmode'))); }
    setTipAmount(data): void {
        localStorage.setItem('tipAmount', this.encrypt(JSON.stringify(data)));
    }
    unsetTipAmount(): void { localStorage.removeItem('tipAmount'); }
    getTipAmount(): any { return this.decrypt(localStorage.getItem('tipAmount')); }
    setDeliveryFee(data): void {
        localStorage.setItem('deliveryFee', this.encrypt(JSON.stringify(data)));
    }
    unsetDeliveryFee(): void { localStorage.removeItem('deliveryFee'); }
    getDeliveryFee(): number { return parseFloat(this.decrypt(localStorage.getItem('deliveryFee'))); }
    setMyOrderState(data): void {
        localStorage.setItem('myOrderState', this.encrypt(data));
    }
    unsetMyOrderState(): void { localStorage.removeItem('myOrderState'); }
    getMyOrderState(): string { return this.decrypt(localStorage.getItem('myOrderState')); }
    setUserDeliveryDateTime(data): void {
        localStorage.setItem('userDeliveryDateTime', this.encrypt(JSON.stringify(data)));
    }
    unsetUserDeliveryDateTime(): void { localStorage.removeItem('userDeliveryDateTime'); }
    getUserDeliveryDateTime(): any { return JSON.parse(this.decrypt(localStorage.getItem('userDeliveryDateTime'))); }
    setNewDeliveryDate(data, establishmentId, cartLength): void {
        let oldDate = this.getUserDeliveryDateTime();
        let delivery;
        if (cartLength == 1) {
            delivery = {
                deliveryDate: data,
                otherDeliveryDate: ''
            }
        } else {
            if (establishmentId == 'est1') {
                delivery = {
                    deliveryDate: data,
                    otherDeliveryDate: oldDate.otherDeliveryDate
                };
            } else {
                delivery = {
                    deliveryDate: oldDate.deliveryDate,
                    otherDeliveryDate: data
                };
            }
        }
        localStorage.setItem('userDeliveryDateTime', this.encrypt(JSON.stringify(delivery)));
    }
    setUserPaymentCard(data): void {
        localStorage.setItem('userPaymentCard', data);
    }
    unsetUserPaymentCard(): void { localStorage.removeItem('userPaymentCard'); }
    getUserPaymentCard(): string { return localStorage.getItem('userPaymentCard'); }
    setTaxRate(data): void {
        localStorage.setItem('taxRate', this.encrypt(JSON.stringify(data)));
    }
    unsetTaxRate(): void { localStorage.removeItem('taxRate'); }
    getTaxRate(): number { return JSON.parse(this.decrypt(localStorage.getItem('taxRate'))); }
    setTaxPrice(data): void {
        localStorage.setItem('taxPrice', this.encrypt(JSON.stringify(data)));
    }
    unsetTaxPrice(): void { localStorage.removeItem('taxPrice'); }
    getTaxPrice(): number { return JSON.parse(this.decrypt(localStorage.getItem('taxPrice'))); }
    setDiscountInfo(data): void {
        localStorage.setItem('discountInfo', data);
    }
    setDiscountJson(data): void {
        localStorage.setItem('discountJson', this.encrypt(JSON.stringify(data)));
    }
    setDefaultDiscountJson(): void {
        localStorage.setItem('discountJson', this.encrypt(JSON.stringify(
            {
                est1: {
                    deposits: 0,
                    discountAmount: 0,
                    discountUsed: 'Invalid Promotion/Referral Code',
                    disctype: 0,
                    marcelDisc: 0,
                    nonTaxableAmt: 0,
                    ntpDiscAmt: 0,
                    promoDisc: 0,
                    taxableAmt: 0,
                    tpDiscAmt: 0,
                    volumeDisc: 0,
                },
                est2: {
                    deposits: 0,
                    discountAmount: 0,
                    discountUsed: 'Invalid Promotion/Referral Code',
                    disctype: 0,
                    marcelDisc: 0,
                    nonTaxableAmt: 0,
                    ntpDiscAmt: 0,
                    promoDisc: 0,
                    taxableAmt: 0,
                    tpDiscAmt: 0,
                    volumeDisc: 0,
                }
            }
        )))
    }
    unsetDiscountInfo(): void {
        localStorage.removeItem('discountInfo');
        localStorage.removeItem('discountJson');
    }
    unsetDiscountJson(): void {
        localStorage.removeItem('discountJson');
    }
    getDiscountInfo(): number { return parseFloat(localStorage.getItem('discountInfo')); }
    getDiscountJson(): void { return JSON.parse(this.decrypt(localStorage.getItem('discountJson'))); }
    setDeliveryFeeJson(data): void {
        localStorage.setItem('deliveryFeeJson', this.encrypt(JSON.stringify(data)));
    }
    unsetDeliveryFeeJson(): void {
        localStorage.removeItem('deliveryFeeJson');
    }
    getDeliveryFeeJson(): void { return JSON.parse(this.decrypt(localStorage.getItem('deliveryFeeJson'))); }
    showflashMessage(type: string, message: string, time: number = 15000) {
        this._flashMessagesService.show(message, { cssClass: 'alert-' + type, timeout: time });
    }
    showAppSpinner() {
    }
    hideAppSpinner() {
    }
       setHeaderCartCheck(doCheck: boolean) {
        this.cartCheck.next(doCheck);
    }
       setAddCardCheck(data: string) {
        localStorage.setItem('showAddCardPopup', data);
    }

    getAddCardCheck() {
        return localStorage.getItem('showAddCardPopup');
    }

    setSameVendorExist(data: string) {
        localStorage.setItem('sameEstablichmentId', data);
    }
    getSameVendorExist() {
        return localStorage.getItem('sameEstablichmentId');
    }

    setLoginPopupCheck(data: string) {
        localStorage.setItem('loginPopupCheck', data);
    }

    getLoginPopupCheck() {
        return localStorage.getItem('loginPopupCheck');
    }

    setShowInviteBand(data: string) {
        localStorage.setItem('showInviteBand', data);
    }

    getShowInviteBand() {
        return localStorage.getItem('showInviteBand');
    }

    setProductToRateCheck(data: string) {
        localStorage.setItem('productToRateCheck', data);
    }

    getProductToRateCheck() {
        return localStorage.getItem('productToRateCheck');
    }

    encrypt(data): string {
        return data;
    }

    decrypt(data): string {
        return data;
    }

    isLoggedIn(): boolean {
        return (localStorage.getItem('currentAccountId') && localStorage.getItem('accessToken')) ? true : false;
    }

    signOut(): boolean {
        this.unsetAllData();
        return true;
    }

    signIn(): boolean {
        this.setShowInviteBand('true');
        return true;
    }

    getCartLocalStorage() {
        let localData = localStorage.getItem('cartLocalStorage');
        if (localData == null) {
            return [];
        } else {
            return JSON.parse(localStorage.getItem('cartLocalStorage'));
        }
    }

    setCartLocalStorage(cartData: any) {
        let cartStorage = JSON.parse(localStorage.getItem('cartLocalStorage'));
        if (cartStorage == null) {
            cartStorage = [cartData];
        } else {
            cartStorage.push(cartData);
        }
        localStorage.setItem('cartLocalStorage', JSON.stringify(cartStorage));
    }

    replaceCartLocalStorage(cartData: any) {
        localStorage.setItem('cartLocalStorage', JSON.stringify(cartData));
    }

    unsetCartLocalStorage() {
        localStorage.removeItem('cartLocalStorage');
    }

    indexOfAny = function (s, arr, begin) {
        var minIndex = -1;
        for (var i = 0; i < arr.length; i++) {
            var index = s.indexOf(arr[i], begin);
            if (index != -1) {
                if (minIndex == -1 || index < minIndex) {
                    minIndex = index;
                }
            }
        }
        return (minIndex);
    }

    splitByAny = function (s, arr) {
        var parts = [];

        var index;
        do {
            index = this.indexOfAny(s, arr);
            if (index != -1) {
                parts.push(s.substr(0, index));
                s = s.substr(index + 1);
            } else {
                parts.push(s);
            }
        } while (index != -1);

        return (parts);
    }

    parseAddress(address) {
        var obj = {
            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        };

        if (!address) {
            return (obj);
        }

        var parts = address.split(',');
        for (var i = 0; i < parts.length; i++) {
            parts[i] = parts[i].trim();
        }
        var i = parts.length - 1;

        var fnIsPostalCode = function (value) {
            return (/^\d+$/.test(value));
        }

        var fnParsePostalCode = (value) => {
            var subParts = this.splitByAny(value, [' ', '-']);
            for (var j = 0; j < subParts.length; j++) {
                if (fnIsPostalCode(subParts[j].trim())) {
                    obj.postalCode = subParts[j].trim();
                    if (j > 0) {
                        return (subParts[j - 1]);
                        // break;
                    }
                }
            }
            return (value);
        }

        if (i >= 0) {
            if (fnIsPostalCode(parts[i])) { obj.postalCode = parts[i]; i--; }
            var part = fnParsePostalCode(parts[i]);
            if (part) { obj.country = part; }
            i--;
        }

        if (i >= 0) {
            if (fnIsPostalCode(parts[i])) { obj.postalCode = parts[i]; i--; }
            var part = fnParsePostalCode(parts[i]);
            if (part) { obj.state = part; }
            i--;
        }

        if (i >= 0) {
            if (fnIsPostalCode(parts[i])) { obj.postalCode = parts[i]; i--; }
            var part = fnParsePostalCode(parts[i]);
            if (part) { obj.city = part; }
            i--;
        }

        if (i >= 0) {
            parts = parts.slice(0, i + 1);
            obj.address = parts.join(', ');
        }

        return (obj);
    }

    unsetAllData() {
        this.setSearchTerm('');
        this.setSearchText('');
        this.unsetAccessToken();
        this.unsetCurrentAccountId();
        this.unsetCurrentEstablishmentId();
        this.unsetCurrentUserData();
        this.unsetShoppingCartCount();
        this.unsetShoppingCartData();
        this.unsetCartEstablishmentId();
        this.unsetUserOrders();
        this.unsetuserDeliveryLocation();
        this.unsetCurrentUserPayment();
        this.unsetDiscountInfo();
        this.unsetuserDeliveryLocationToUse();
        this.setShowInviteBand('true');

        this.afterCheckout();
    }

    afterCheckout() {
        this.unsetCartEstablishmentId();
        this.unsetShoppingCartCount();
        this.unsetShoppingCartData();
        this.unsetUserPaymentCard();
        this.unsetUserDeliveryDateTime();
        this.unsetDiscountInfo();
        this.unsetTipAmount();
        this.unsetDeliveryFee();
        this.unsetDiscountJson();
    }
    setCustomJsToFormData() {
        $('.form-group input').change(function () {
            if ($(this).val() != '') {
                $(this).addClass('filled');
            } else {
                $(this).removeClass('filled');
            }
        });

        $('.form-group input').each(function () {
            if ($(this).val() != '') {
                $(this).addClass('filled');
            } else {
                $(this).removeClass('filled');
            }
        });

        $('.form-control').focus(function () {
            $(this).parent().addClass('focused');

        }).blur(function () {
            $(this).parent().removeClass('focused');
        });
    }
    // for scroll down filter in productListing
    scrollDownFilter() {
        $(document).ready(function () {
            var $sticky = $('.sticky');
            var $stickyrStopper = $('.sticky-stopper');
            if (!!$sticky.offset()) { // make sure ".sticky" element exists

                var generalSidebarHeight = $sticky.innerHeight();
                var stickyTop = $sticky.offset().top;
                var stickOffset = 150;
                var stickyStopperPosition = $stickyrStopper.offset().top;
                var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset;
                var diff = stopPoint + stickOffset;

                $(window).scroll(function () { // scroll event
                    var windowTop = $(window).scrollTop(); // returns number

                    if (stopPoint < windowTop) {
                        $sticky.css({ position: 'absolute', bottom: '30px', top: 'initial' });
                    } else if (stickyTop < windowTop + stickOffset) {
                        $sticky.css({ position: 'fixed', top: stickOffset, bottom: 'auto' });
                    } else {
                        $sticky.css({ position: 'absolute', top: 'initial', bottom: 'auto' });
                    }
                });
            }
        });
    }
    // custome js for book bar tenders
    barTenderFormJs() {
        $(function () {
            $('.form-group input').change(function () {
                if ($(this).val() != '') {
                    $(this).addClass('filled');
                } else {
                    $(this).removeClass('filled');
                }
            });
            $('.form-group input').each(function () {
                if ($(this).val() != '') {
                    $(this).addClass('filled');
                } else {
                    $(this).removeClass('filled');
                }
            });
            $('.form-control').focus(function () {
                $(this).parent().addClass('focused');
            }).blur(function () {
                $(this).parent().removeClass('focused');
            });
        });
    }
    // new data for book a bartenders
    setBartenderForm() {
        $(function () {
            jQuery('#timepicker').timepicker({
                dynamic: false,
                dropdown: true,
                scrollbar: true,
                change: function () {
                    $('#timepicker').addClass('filled');
                }
            });
            jQuery('#timepicker1').timepicker({
                dynamic: false,
                dropdown: true,
                scrollbar: true,
                change: function () {
                    $('#timepicker1').addClass('filled');
                }
            });
        });
        $(function () {
            jQuery('.calendar').datepicker({
                firstDay: 1,
                minDate: new Date(),
                onSelect: function (dateText, inst) {
                    $('#datevalue').addClass('filled');
                    $('.whenIsItDatepicker').val(moment(dateText, 'MM-DD-YYYY').format('MMMM D, YYYY'));
                    $('.formsection').trigger('click');
                    },
            });
        });
        jQuery('.calendar').click(function(e) {
            e.stopPropagation();
        });

    }
    setAnimationToCategoryFilter(el) {
        var container = el;
        $(container).on('click', container.find('.accord-heading'), (e) => {
            if ($(e.target).hasClass('accord-heading')) {

                $(el).find('.accord-content').slideUp(250);
                $(el).find('li').removeClass('active');

                if ($(e.target).siblings('.accord-content').css('display') === 'block') {
                    $(e.target).siblings('.accord-content').slideUp(250);
                    $(e.target).parents('li').removeClass('active');
                } else {
                    $(e.target).siblings('.accord-content').slideDown(250);
                    $(e.target).parents('li').addClass('active');
                    $(e.target).addClass('active');
                }
                setTimeout(() => {
                    this.scrollDownFilter();
                }, 300);
            } else {
                if ($(e.target).parents('li').find('.accord-content').css('display') === 'block') {
                    if ($(e.target).is('img')) {
                        $(e.target).parents('li').find('.accord-content').slideUp(250);
                        $(e.target).parents('li').removeClass('active');
                    }
                } else {
                    if ($(e.target).is('img')) {
                        $(e.target).parents('li').find('.accord-content').slideDown(250);
                        $(e.target).parents('li').addClass('active');
                    }
                   }
                setTimeout(() => {
                    this.scrollDownFilter();
                }, 300);
            }
        });
    }
    customScoll() {
        $(document).ready(function () {
            var $sticky = $('.sticky');
            var $stickyrStopper = $('.sticky-stopper');
            if (!!$sticky.offset()) { // make sure ".sticky" element exists

                var generalSidebarHeight = $sticky.innerHeight();
                var stickyTop = $sticky.offset().top;
                var stickOffset = 150;
                var stickyStopperPosition = $stickyrStopper.offset().top;
                var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset;
                var diff = stopPoint + stickOffset;

                $(window).scroll(function () { // scroll event
                    var windowTop = $(window).scrollTop(); // returns number
                    if (stopPoint < windowTop) {
                        $sticky.css({ position: 'absolute', bottom: '0px', top: 'initial' });
                    } else if (stickyTop < windowTop + stickOffset) {
                        // $sticky.css({ position: 'fixed', top: stickOffset, width: 'min-content' });
                        $sticky.css({ position: 'fixed', top: stickOffset });
                    } else {
                        $sticky.css({ position: 'absolute', top: 'initial', bottom: 'auto' });
                    }
                });
            }

        });
    }
    customScollOnRemove() {
        var $sticky = $('.sticky');
        var $stickyrStopper = $('.sticky-stopper');
        if (!!$sticky.offset()) { // make sure ".sticky" element exists
            var generalSidebarHeight = $sticky.innerHeight();
            var stickyTop = $sticky.offset().top;
            var stickOffset = 150;
            var stickyStopperPosition = $stickyrStopper.offset().top;
            var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset;
            var diff = stopPoint + stickOffset;

            var windowTop = $(window).scrollTop(); // returns number
            if (stopPoint < windowTop) {
                $sticky.css({ position: 'absolute', bottom: '0px', top: 'initial' });
            } else if (stickyTop < windowTop + stickOffset) {
                $sticky.css({ position: 'fixed', top: stickOffset, width: 'min-content' });
            } else {
                $sticky.css({ position: 'absolute', top: 'initial', bottom: 'auto' });
            }
        }
    }

    customSrollPlaceOrder() {
        var $sticky = $('.sticky');
        var $stickyrStopper = $('.sticky-stopper');
            if (!!$sticky.offset()) { // make sure ".sticky" element exists
            var generalSidebarHeight = $sticky.innerHeight();
            var stickyTop = $sticky.offset().top;
            var stickOffset = 150;
            var stickyStopperPosition = $stickyrStopper.offset().top;
            var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset;
            var diff = stopPoint + stickOffset;
            $(window).scroll(function () { // scroll event
                var windowTop = $(window).scrollTop(); // returns number

                if (stopPoint < windowTop) {
                    $sticky.css({ position: 'absolute', bottom: '0px', top: 'initial' });
                } else if (stickyTop < windowTop + stickOffset) {
                    $sticky.css({ position: 'fixed', width: 'min-content', top: stickOffset });
                } else {
                    $sticky.css({ position: 'absolute', top: 'initial', bottom: 'auto' });
                }
            });

        }
    }
    mobilejs() {
        jQuery.fn.ashCordian = function() {
            var container = $(this);
            container.find('.accord-heading').click(function() {
             $("#accord1 li").removeClass("active");
             if($(this).siblings('.accord-content').css('display') == 'block') {
                container.find('.accord-content').slideUp(250);
                $(this).parents('li').removeClass("active");
             } else {
                container.find('.accord-content').slideUp(250);
                $(this).siblings('.accord-content').slideDown(250);
                $(this).parents('li').addClass("active");
             }
            });
          };
          jQuery('#accorddesktop').ashCordian();
          jQuery.fn.ashCordian = function() {
            var container = $(this);
            container.find('.accord-heading').click(function() {
             $("#accord1 li").removeClass("active");
             if($(this).siblings('.accord-content').css('display') == 'block') {
                container.find('.accord-content').slideUp(250);
                $(this).parents('li').removeClass("active");
             } else {
                container.find('.accord-content').slideUp(250);
                $(this).siblings('.accord-content').slideDown(250);
                $(this).parents('li').addClass("active");
             }
            });
          };
          jQuery('#accordmobile').ashCordian();



        $(document).ready(function(){
            $('#opennav').on('click', function(){
                $('.sidenav').css('right', '0px');
                $('#backdrop_overlay').css('display', 'block');
                // $('body').css('overflow','hidden');
                document.body.style.overflowY = "hidden";
            });
            $('#backdrop_overlay').on('click', function(){
                $('.sidenav').css('right', '-260px');
                $('#backdrop_overlay').css('display', 'none');
                document.body.style.overflowY = "visible";
            });
           });

           $( document ).ready(function() {
            // console.log( "document ready!" );
 
            var $sticky = $('.sticky');
            var $stickyrStopper = $('.sticky-stopper');
            if (!!$sticky.offset()) { // make sure ".sticky" element exists
 
              var generalSidebarHeight = $sticky.innerHeight();
              var stickyTop = $sticky.offset().top;
              var stickOffset = 150;
              var stickyStopperPosition = $stickyrStopper.offset().top;
              var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset;
              var diff = stopPoint + stickOffset;
 
              $(window).scroll(function(){ // scroll event
                var windowTop = $(window).scrollTop(); // returns number
 
                if (stopPoint < windowTop) {
                    $sticky.css({ position: 'absolute', bottom: '30px', top: 'initial' });
                } else if (stickyTop < windowTop+stickOffset) {
                    $sticky.css({ position: 'fixed', top: stickOffset, bottom: 'auto' });
                } else {
                    $sticky.css({position: 'absolute', top: 'initial', bottom: 'auto'});
                }
              });
 
            }
          });





    //     $(function () {
    //         console.log('here is mobile js loaded');
    //         $('#stores ul li').click(function () {
    //             console.log('here is mobile js loaded');
    //             $('.mobileview-productlisting').css(
    //                 {
    //                     'transform': 'translate(0%)',
    //                     'transition': 'all linear 0.2s'
    //                 }
    //             );
    //         });
    //         $('.close-productListing-btn').click(function () {
    //             $('.mobileview-productlisting').css(
    //                 { 'transform': 'translate(100%)' }
    //             );
    //         });

    //     });
       
    // }
}
}

