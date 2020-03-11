import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import { UserService } from '../../shared/services/user.service';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Angulartics2Facebook } from 'angulartics2/facebook';
declare var jQuery: any;

declare var $: any;
@Component({
    selector: 'app-cart-placeorder',
    templateUrl: './cart-placeorder.component.html',
    styleUrls: ['./cart-placeorder.component.css']
})
export class CartPlaceorderComponent implements OnInit {

    public cartItems: Array<any> = [];
    public establishmentData: Array<any> = [];
    public establishmentId: string = '';
    public taxBasedOnEstablishment: number = 0;
    public deliveryDateTime: any = {};
    public deliveryFee: number = 0;
    public tipAmountToDisplay: any = 0;
    public userSavedCards: Array<any> = [];
    public selectedCardData: Array<any> = [];
    public placeOrderIsDisabled: boolean = false;
    public isCardSelected: boolean = false;
    public userPickupTime: void = this.userService.getUserDeliveryDateTime();
    public submitIsDisabled: boolean = false;
    public d = new Date();
    public currentYear = this.d.getFullYear();
    public currentMonth = this.d.getMonth();
    public establishmentIdArray = [];
    public discountJsonToDisplay = this.userService.getDiscountJson();
    public content_ids: Array<any> = [];
    public totalPrice: number = 0;
    private subscription
    datepickerCheckInterval: any;
    // datepickerCheckInterval1: any;

    public establishment1: any;
    public establishment2: any;
    public esablishmentIds: any;
    public deliveryMessage: any;
    public DeliveryDate: any;
    public est1Date: any;
    public est2Date: any;
    public estname1: any;
    public estname2: any;
    public est1: any;
    public est2: any;
    public estCat1: any;
    public estCat2: any;
    public todayDate1: any;

    public cartData: any;

    public todayDate: any;
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    date: any;

    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router,
        private location: Location,
        private Angulartics2Facebook: Angulartics2Facebook
    ) {

    }

    ngOnInit() {

        this.date = moment(new Date()).format('MM-DD-YYYY');
        // this.currentDate=moment(new Date()).format();
        // this.setTodayDate();
        // this.setTodayDate1();
        setTimeout(() => {
            // $('.calendar').datepicker({
            //     firstDay: 1,
            //     onSelect: function (dateText) {
            //         $('.whenIsItDatepicker').val(moment(dateText, 'MM-DD-YYYY').format('MMMM D, YYYY'));
            //     }
            // });
            // $('.calendar1').datepicker({
            //     firstDay: 1,
            //     onSelect: function (dateText) {
            //         $('.whenIsItDatepicker').val(moment(dateText, 'MM-DD-YYYY').format('MMMM D, YYYY'));
            //     }
            // });
            this.userService.customSrollPlaceOrder();
        }, 2000);

        console.log(this.discountJsonToDisplay);
        //     this.location.onPopState(() => {
        //         console.log('hey');
        //        this.router.navigate(['/productlisting']);

        //    });
        this.location.subscribe(x => console.log(x));
        this.ProviderServiceService.getUserSavedCards((data) => {
            console.log(data);
            this.userSavedCards = data.sources.data;
            if (data.sources.data.length > 0) {
                this.selectedCardData = this.userSavedCards;
                this.userService.setUserPaymentCard(data.sources.data[0].id);
                this.isCardSelected = true;
                this.placeOrderIsDisabled = false;
            } else {
                console.log('hey324');
                this.isCardSelected = false;
                this.placeOrderIsDisabled = false;
                this.userService.setAddCardCheck('true');
            }
        });
        this.userService.setCustomJsToFormData();//to set custom js to form data
        this.fetchUserShoppingCartData();
        this.deliveryDateTime = this.userService.getUserDeliveryDateTime();
        console.log('this.deliveryDateTime', this.deliveryDateTime);
        this.deliveryFee = this.userService.getDeliveryFee();
        this.tipAmountToDisplay = this.userService.getTipAmount() == null || this.userService.getTipAmount() == '' ? 0 : this.userService.getTipAmount();
        console.log(typeof jQuery('#datepicker').datepicker);
        this.datepickerCheckInterval = setInterval(() => {
            console.log(typeof jQuery('#datepicker').datepicker);
            clearInterval(this.datepickerCheckInterval);
            let self = this;
            (jQuery('#datepicker')).datepicker({
                firstDay: 1, minDate: 0,
                dateFormat: 'mm-dd-yy',
                onSelect: function (dateText) {
                    $('#dateForServer1').text(moment(dateText, 'MM-DD-YYYY').format('MMMM D, YYYY'));
                    self.userService.setDateDelivery(dateText);
                    self.setDate(dateText, 'est1');
                    $(".container").trigger('click');
                }
            }).datepicker('setDate', moment(this.deliveryDateTime.deliveryDate).format('MM-DD-YYYY'));
            (jQuery('#datepicker1')).datepicker({
                firstDay: 1, minDate: 0,
                dateFormat: 'mm-dd-yy',
                onSelect: function (dateText) {
                    $('#dateForServer1').text(moment(dateText, 'MM-DD-YYYY').format('MMMM D, YYYY'));
                    self.userService.setDateDelivery(dateText);
                    self.setDate(dateText, 'est2');
                    $(".container").trigger('click');
                }
            }).datepicker('setDate', moment(this.deliveryDateTime.deliveryDate).format('MM-DD-YYYY'));
            $('#dateForServer1').text(moment(this.deliveryDateTime.deliveryDate).format('MMMM D, YYYY'));
        }, 10);
    }
    ngOnDestroy() {
        //  this.location.unsubscribe();
    }

    public setDate(dateText, establishmentId) {
        let estid;

        if (establishmentId == 'est1') {
            estid = this.est1;
            console.log(this.est1);

        }
        else {
            estid = this.est2;
            console.log(this.est2);

        }
        // console.log(establishmentId);
        console.log(dateText);
        this.ProviderServiceService.getDeliveryDates(dateText)
            .subscribe(data => {
                console.log(data);
                if (data.error) {
                    this.userService.showflashMessage('danger', data.error.message);
                } else {
                    // console.log(data.deliveryDate);
                    // this.userService.setUserDeliveryDateTime(data);
                    this.deliveryDateTime = this.userService.getUserDeliveryDateTime();

                }
            });
        this.ProviderServiceService.validateDeliveryDate(dateText, estid)
            .subscribe(data => {
                console.log('validateDeliveryDate', data);
                if (data.error) {
                    this.userService.showflashMessage('danger', data.error.message);
                } else {
                    console.log(data.deliveryDate);
                    let date = moment(data.deliveryDate).format('MMMM D, YYYY');
                    this.userService.setNewDeliveryDate(data.deliveryDate, establishmentId,this.cartData.length);
                    // this.userService.setUserDeliveryDateTime(data);
                    this.DeliveryDate = this.userService.getUserDeliveryDateTime();
                    this.est1Date = (moment(this.DeliveryDate.deliveryDate).format('MMMM D, dddd'));
                    this.est2Date = (moment(this.DeliveryDate.otherDeliveryDate).format('MMMM D, dddd'));
                }
            });
    }

    setTodayDate() {

        // console.log);
        console.log('clicked');
        let self = this;
        (<any>$('#datepicker')).datepicker({
            dateFormat: 'mm-dd-yy',
        }).datepicker('setDate', 'today');
        this.todayDate = (<any>$('#datepicker')).datepicker('getDate');
        console.log(this.todayDate);
        this.todayDate = moment(this.todayDate).format('MM-DD-YYYY');
        this.setDate(this.todayDate, 'est1');
        this.userService.setDateDelivery(this.todayDate);
        $('#dateForServer1').text(moment(new Date()).format('MM-DD-YYYY'));
        console.log(this.todayDate);
    }
    try() {
        console.log('try');
    }
    setTodayDate1() {
        console.log('called');
        (<any>$('#datepicker1')).datepicker({
            dateFormat: 'mm-dd-yy',
        }).datepicker('setDate', 'today');
        this.todayDate1 = (<any>$('#datepicker1')).datepicker('getDate');
        console.log(this.todayDate1);
        this.todayDate1 = moment(this.todayDate1).format('MM-DD-YYYY');
        this.setDate(this.todayDate1, 'est2');
        this.userService.setDateDelivery(this.todayDate1);
        $('#dateForServer1').text(moment(new Date()).format('MM-DD-YYYY'));
    }
    getAvailableDates() {

    }

    public fetchUserShoppingCartData() {
        this.ProviderServiceService.getShoppingCart()
            .subscribe(data => {
                this.cartData = data;
                console.log(data[0].offer.establishment);
                this.ProviderServiceService.getUserDiscountInfo().subscribe(res => {
                    console.log(res);
                    this.esablishmentIds = res;
                    console.log(this.esablishmentIds);
                    this.estCat1 = this.esablishmentIds.est1.estCategory;
                    this.estCat2 = this.esablishmentIds.est2.estCategory;
                    this.est1 = this.esablishmentIds.est1.establishmentId;
                    this.est2 = this.esablishmentIds.est2.establishmentId;

                    this.cartData.forEach((item) => {
                        if (item.offer.establishmentId == this.est1) {
                            this.estname1 = item.offer.establishment.name;
                        } else if (item.offer.establishmentId == this.est2) {
                            this.estname2 = item.offer.establishment.name;
                        }
                    });
                    // if (data.length == 1) {
                    //     console.log('im one');
                    //     this.estname1 = data[0].offer.establishment.name;
                    //     this.estname2 = data[0].offer.establishment.name;
                    // }

                    this.establishment1 = data.filter(d => d.establishmentId == this.est1);
                    this.establishment2 = data.filter(d => d.establishmentId == this.est2);


                    // console.log(this.estname1);
                    console.log('est1:', this.establishment1);
                    console.log('est2:', this.establishment2);

                    this.DeliveryDate = this.userService.getUserDeliveryDateTime();
                    console.log(this.DeliveryDate);
                    // console.log(this.DeliveryDate.otherDeliveryDate);
                    if (data.length == 1) {
                        console.log(this.esablishmentIds.est1.deliveryDate);
                        this.est1Date = (moment(this.DeliveryDate.deliveryDate).format('MMMM D, dddd'));
                        this.est2Date = (moment(this.DeliveryDate.deliveryDate).format('MMMM D, dddd'));

                    }
                    else {
                        this.est1Date = (moment(this.DeliveryDate.deliveryDate).format('MMMM D, dddd'));
                        this.est2Date = (moment(this.DeliveryDate.otherDeliveryDate).format('MMMM D, dddd'));
                    }
                    this.userService.setShoppingCartData(data);
                    this.userService.setShoppingCartCount(data.length);
                    this.cartItems = data;
                    if (data.length > 0) {
                        this.cartItems.forEach((element, index) => {
                            if (this.establishmentIdArray.indexOf(element.establishmentId) == -1) {
                                this.establishmentIdArray.push(element.establishmentId);
                            }
                        });

                        if (this.establishmentIdArray.length > 1) {
                            Observable.forkJoin(
                                this.ProviderServiceService.getEstablishmentDetails(this.establishmentIdArray[0]),
                                this.ProviderServiceService.getEstablishmentDetails(this.establishmentIdArray[1]),
                            ).subscribe(data => {
                                this.ProviderServiceService.getTaxFromLatLong(data[0].geoLocation.coordinates[1], data[0].geoLocation.coordinates[0], response1 => {
                                    this.ProviderServiceService.getTaxFromLatLong(data[1].geoLocation.coordinates[1], data[1].geoLocation.coordinates[0], response2 => {
                                        let taxInfoJson = {
                                            [data[0].id]: parseFloat(response1.combined_rate),
                                            [data[1].id]: parseFloat(response2.combined_rate)
                                        };

                                        // this.taxBasedOnEstablishment = parseFloat(response.combined_rate);
                                        this.userService.setTaxRate(taxInfoJson);
                                        this.refreshCart();
                                    });
                                });

                            }, error => {
                                if (error.message == 'Authorization Required' || error.message == 'Invalid Access Token' || error.statusText == 'Unauthorized') {
                                    this.userService.setLoginPopupCheck('true');
                                }
                                this.userService.hideAppSpinner();
                            });
                        } else {
                            this.establishmentData = data[0].offer.establishment;
                            this.userService.setCartEstablishmentId(data[0].offer.establishmentId);

                            this.establishmentId = this.userService.getCartEstablishmentId();
                            this.ProviderServiceService.getEstablishmentDetails(this.establishmentId)
                                .subscribe(data => {
                                    this.establishmentData = data;
                                    this.ProviderServiceService.getTaxFromLatLong(data.geoLocation.coordinates[1], data.geoLocation.coordinates[0], response => {
                                        // this.taxBasedOnEstablishment = parseFloat(response.combined_rate);
                                        let taxInfoJson = {
                                            [data.id]: parseFloat(response.combined_rate)
                                        };
                                        this.userService.setTaxRate(taxInfoJson);
                                        this.refreshCart();
                                    });
                                });
                        }
                    }
                });
            });
    }

    refreshCart() {
        if (this.userService.isLoggedIn()) {
            this.cartItems = JSON.parse(this.userService.getShoppingCartData());
            this.userService.setHeaderCartCheck(true);
        } else {
            this.cartItems = this.userService.getCartLocalStorage();
            this.userService.setHeaderCartCheck(true);
        }
    }

    selectCardForPayment(args: any) {
        console.log(args);
        let selectedCardId = $(args.currentTarget).find('span').attr('data-card-id');
        console.log($('#paymentChange .labelItem'));

        $('#paymentChange .labelItem').removeClass('selected');
        $(args.currentTarget).find('.labelItem').addClass('selected');
        console.log($(args.currentTarget).find('.labelItem'));

        this.selectedCardData = this.userSavedCards.filter(
            cards => {
                return (selectedCardId == cards.id) ? true : false;
            }
        );
        this.userService.setUserPaymentCard(selectedCardId);
        this.isCardSelected = true;

        console.log('selectedCardDate', this.selectedCardData);
    }

    public place_order() {
        this.userService.showAppSpinner();
        if (this.isCardSelected == false) {
            this.userService.showflashMessage('danger', 'Please select card to make payment');
            return false;
        }
        if (confirm('You will be charged $' + parseFloat($('#hiddentnuoma').val()).toFixed(2) + ' for this order. Do you want to continue?')) {
            this.placeOrderIsDisabled = true;
            this.ProviderServiceService.preCheckoutShoppingCart()
                .subscribe(data => {
                    if (data.notavailable.length > 0) {
                        window.scrollTo(0, 0);
                        this.userService.showflashMessage('danger', 'Highlighted items are not available in required quantity');
                        data.notavailable.forEach(element => {
                            $('.cartpage2-table tr[data-cartId=' + element.id + ']').addClass('notAvailable');
                        });
                        this.placeOrderIsDisabled = false;
                        this.userService.hideAppSpinner();
                    } else if (data.notavailable.length == 0) {
                        $('tr').removeClass('notAvailable');
                        this.placeOrderIsDisabled = true;

                        this.ProviderServiceService.setUserDefaultCard(this.userService.getUserPaymentCard(), data => {
                            if (this.establishmentIdArray.length > 1) {
                                console.log('multiple orders');

                                Observable.forkJoin(
                                    this.ProviderServiceService.getEstablishmentStripeAccount(this.establishmentIdArray[0]),
                                    this.ProviderServiceService.getEstablishmentStripeAccount(this.establishmentIdArray[1]),
                                ).subscribe(data => {
                                    let destination_account = {};
                                    let merchantOne = data[0];
                                    let merchantTwo = data[1];
                                    let merchantOneStripeId = '';
                                    let merchantTwoStripeId = '';
                                    if (merchantOne.length > 0 && merchantOne[0].bizaccount && merchantOne[0].bizaccount.paymentIds && merchantOne[0].bizaccount.paymentIds[0] && merchantOne[0].bizaccount.paymentIds[0].token) {
                                        merchantOneStripeId = merchantOne[0].bizaccount.paymentIds[0].token;
                                        destination_account[merchantOne[0].id] = merchantOneStripeId;
                                    }
                                    if (merchantTwo.length > 0 && merchantTwo[0].bizaccount && merchantTwo[0].bizaccount.paymentIds && merchantTwo[0].bizaccount.paymentIds[0] && merchantTwo[0].bizaccount.paymentIds[0].token) {
                                        merchantTwoStripeId = merchantTwo[0].bizaccount.paymentIds[0].token;
                                        destination_account[merchantTwo[0].id] = merchantTwoStripeId;
                                    }

                                    if (merchantOneStripeId != '' && merchantTwoStripeId != '') {
                                        let finalDetails: any = {
                                            amount: parseInt(($('#hiddentnuoma').val() * 100).toFixed(2)),
                                            customerId: this.userService.getCurrentUserPayment(),
                                            source: this.userService.getUserPaymentCard(),
                                            deliveryDateTime: this.userService.getUserDeliveryDateTime(),
                                            accountId: this.userService.getCurrentAccountId(),
                                            accessToken: this.userService.getAccessToken(),
                                            taxAmount: this.userService.getTaxPrice(),
                                            taxPercent: this.userService.getTaxRate(),
                                            discountApplied: this.userService.getDiscountJson(),
                                            deliveryFee: this.userService.getDeliveryFee(),
                                            tipAmount: parseFloat(this.userService.getTipAmount()),
                                            deliveryInstructions: $('#deliveryInstructions').val(),
                                            platform: 'web'
                                        };
                                        console.log(this.deliveryDateTime);
                                        finalDetails.destination_account = destination_account;
                                        console.log('finalDetails', finalDetails);
                                        // return;
                                        this.ProviderServiceService.create_charge_multiple(finalDetails, response => {
                                            if (response.status == 'error') {
                                                window.scrollTo(0, 0);
                                                this.placeOrderIsDisabled = false;
                                                if (response.discountUsed) {
                                                    this.userService.showflashMessage('danger', response.discountUsed);
                                                } else if (response.message == 'Authorization Required' || response.message == 'Invalid Access Token' || response.statusText == 'Unauthorized') {
                                                    this.userService.setLoginPopupCheck('true');
                                                }
                                                this.userService.hideAppSpinner();
                                            } else if (typeof response.statusCode != 'undefined') {
                                                window.scrollTo(0, 0);
                                                this.placeOrderIsDisabled = false;
                                                this.userService.showflashMessage('danger', response.message);
                                            } else {
                                                console.log('order placed successfully')
                                                this.cartItems.forEach((item) => {
                                                    this.content_ids.push(item.offerId);
                                                    this.totalPrice += item.offer.salePrice;
                                                })
                                                this.Angulartics2Facebook.eventTrack('Purchase', {
                                                    content_ids: this.content_ids,
                                                    content_type: 'product',
                                                    value: this.totalPrice,
                                                    currency: 'USD'
                                                });

                                                this.userService.hideAppSpinner();
                                                this.userService.afterCheckout();
                                                this.router.navigate(['/checkout-summary', '1']);
                                            }
                                        });
                                    } else {
                                        window.scrollTo(0, 0);
                                        this.placeOrderIsDisabled = false;
                                        this.userService.showflashMessage('danger', 'Store doesn\'t have a Payment Account Setup yet. Please try ordering from a different store.');
                                        this.userService.hideAppSpinner();
                                    }
                                }, error => {
                                    if (error.message == 'Authorization Required' || error.message == 'Invalid Access Token' || error.statusText == 'Unauthorized') {
                                        this.userService.setLoginPopupCheck('true');
                                    }
                                    this.userService.hideAppSpinner();
                                });
                            } else {
                                let discountJson = this.userService.getDiscountJson();
                                let discountApplied;
                                if (typeof discountJson['est1'].establishmentId != 'undefined' && discountJson['est1'].establishmentId == this.userService.getCartEstablishmentId()) {
                                    discountApplied = discountJson['est1'];
                                } else if (typeof discountJson['est2'].establishmentId != 'undefined' && discountJson['est2'].establishmentId == this.userService.getCartEstablishmentId()) {
                                    discountApplied = discountJson['est2'];
                                }

                                let finalDetails: any = {
                                    amount: parseInt(($('#hiddentnuoma').val() * 100).toFixed(2)),
                                    customerId: this.userService.getCurrentUserPayment(),
                                    source: this.userService.getUserPaymentCard(),
                                    deliveryDateTime: this.userService.getUserDeliveryDateTime().deliveryDate,
                                    accountId: this.userService.getCurrentAccountId(),
                                    accessToken: this.userService.getAccessToken(),
                                    taxAmount: this.userService.getTaxPrice()[this.userService.getCartEstablishmentId()],
                                    taxPercent: this.userService.getTaxRate()[this.userService.getCartEstablishmentId()],
                                    establishmentId: this.userService.getCartEstablishmentId(),
                                    discountApplied: discountApplied,
                                    deliveryFee: this.userService.getDeliveryFee(),
                                    tipAmount: parseFloat(this.userService.getTipAmount()),
                                    deliveryInstructions: $('#deliveryInstructions').val(),
                                    platform: 'web'
                                }
                                console.log(this.userService.getUserDeliveryDateTime().deliveryDate);
                                console.log('finalDetails', finalDetails);
                                // return;
                                this.ProviderServiceService.getEstablishmentStripeAccount(this.userService.getCartEstablishmentId())
                                    .subscribe(data => {
                                        if (data.length > 0 && data[0].bizaccount && data[0].bizaccount.paymentIds && data[0].bizaccount.paymentIds[0] && data[0].bizaccount.paymentIds[0].token) {
                                            finalDetails.destination_account = data[0].bizaccount.paymentIds[0].token;
                                            this.ProviderServiceService.create_charge(finalDetails, response => {
                                                if (response.status == 'error') {
                                                    window.scrollTo(0, 0);
                                                    this.placeOrderIsDisabled = false;
                                                    if (response.discountUsed) {
                                                        this.userService.showflashMessage('danger', response.discountUsed);
                                                    } else if (response.message == 'Authorization Required' || response.message == 'Invalid Access Token' || response.statusText == 'Unauthorized') {
                                                        this.userService.setLoginPopupCheck('true');
                                                    }
                                                    this.userService.hideAppSpinner();
                                                } else if (typeof response.statusCode != 'undefined') {
                                                    window.scrollTo(0, 0);
                                                    this.placeOrderIsDisabled = false;
                                                    this.userService.showflashMessage('danger', response.message);
                                                } else {
                                                    this.cartItems.forEach((item) => {
                                                        this.content_ids.push(item.offerId);
                                                        this.totalPrice += item.offer.salePrice;
                                                    })
                                                    this.Angulartics2Facebook.eventTrack('Purchase', {
                                                        content_ids: this.content_ids,
                                                        content_type: 'product',
                                                        value: this.totalPrice,
                                                        currency: 'USD'
                                                    });
                                                    console.log(response);
                                                    this.userService.hideAppSpinner();
                                                    this.userService.afterCheckout();
                                                    this.router.navigate(['/checkout-summary', response[0].id]);
                                                }
                                            });
                                        } else {
                                            window.scrollTo(0, 0);
                                            this.placeOrderIsDisabled = false;
                                            this.userService.showflashMessage('danger', 'Store doesn\'t have a Payment Account Setup yet. Please try ordering from a different store.');
                                            this.userService.hideAppSpinner();
                                        }
                                    });
                            }
                        });
                    } else {
                        window.scrollTo(0, 0);
                        this.userService.showflashMessage('danger', 'Error occured. Please try again');
                        this.userService.hideAppSpinner();
                    }
                }, error => {
                    if (error.message == 'Authorization Required' || error.message == 'Invalid Access Token' || error.statusText == 'Unauthorized') {
                        this.userService.setLoginPopupCheck('true');
                    }
                    this.userService.hideAppSpinner();
                });
        } else {
            this.placeOrderIsDisabled = false;
            this.userService.hideAppSpinner();
        }
    }

    showAddCardError(message) {
        console.log(message);
        $('#addCardError').html(message).removeClass('hidden');
        setTimeout(function () {
            $('#addCardError').html('').addClass('hidden');
        }, 5000);
        this.submitIsDisabled = false;
    }

    saveCardDetailsToStripe() {
        this.userService.showAppSpinner();
        let isError = false;
        this.submitIsDisabled = true;

        if ($('[name=\'cvv\']').val() == '' || $('[name=\'zip\']').val() == '' || $('[name=\'name\']').val() == '' || $('[name=\'number\']').val() == '' || $('[name=\'month\']').val() == '') {

            window.scrollTo(0, 0);
            this.showAddCardError('Please fill in all the details to continue');
            this.submitIsDisabled = false;
            this.userService.hideAppSpinner();
            return true;
        }

        let cardDetail = {
            name: $('[name=\'name\']').val(),
            number: $('[name=\'number\']').val(),
            exp_month: $('[name=\'month\']').val().split('/')[0].trim(),
            exp_year: $('[name=\'month\']').val().split('/')[1].trim(),
            zipcode: $('[name=\'zip\']').val(),
            cvc: $('[name=\'cvv\']').val()
        }
        console.log(cardDetail);
        //Month Validation
        if (cardDetail.exp_month == '') {
            // this.userService.showflashMessage("danger", "Expiry Month is required");
            this.showAddCardError('Expiry Month is required');
            isError = true;
        } else {
            if (isNaN(cardDetail.exp_month)) {
                // this.userService.showflashMessage("danger", "Expiry month should be a valid number");
                this.showAddCardError('Expiry month should be a valid number');
                isError = true;
            } else if (cardDetail.exp_month < 1 || cardDetail.exp_month > 12) {
                // this.userService.showflashMessage("danger", "Expiry Month should be 0 and 12");
                this.showAddCardError('Expiry Month should be 1 and 12');
                isError = true;
            }
        }


        //Year Validation
        if (cardDetail.exp_year == '') {
            // this.userService.showflashMessage("danger", "Expiry Year is requried");
            this.showAddCardError('Expiry Year is requried');
            isError = true;
        } else if (cardDetail.exp_year.length < 4 || isNaN(cardDetail.exp_month)) {
            // this.userService.showflashMessage("danger", "Expiry Year should be a valid 4-digit number");
            this.showAddCardError('Expiry Year should be a valid 4-digit number');
            isError = true;
        } else if (cardDetail.exp_year == this.currentYear && cardDetail.exp_month < this.currentMonth) {
            // this.userService.showflashMessage("danger", "Card is already expired");
            this.showAddCardError('Card is already expired');
            isError = true;
        } else if (cardDetail.exp_year < this.currentYear) {
            // this.userService.showflashMessage("danger", "Expiry Year should be greater than current year");
            this.showAddCardError('Expiry Year should be greater than current year');
            isError = true;
        }

        //CVV Validation
        if (cardDetail.cvc == '') {
            // this.userService.showflashMessage("danger", "CVV is required");
            this.showAddCardError('CVV is required');
            isError = true;
        } else if (cardDetail.cvc.length < 3 || isNaN(cardDetail.cvc)) {
            // this.userService.showflashMessage("danger", "CVV should be valid 3-digit number");
            this.showAddCardError('CVV should be valid 3-digit number');

            isError = true;
        }

        if (isError) {
            window.scrollTo(0, 0);
            this.userService.hideAppSpinner();
            this.submitIsDisabled = false;
            return true;
        } else {
            this.ProviderServiceService.addUserSavedCards(cardDetail, response => {
                console.log(response);
                this.ProviderServiceService.getUserSavedCards(data => {
                    this.userSavedCards = data.sources.data;
                    if (data.sources.data.length > 0) {
                        this.selectedCardData = this.userSavedCards;
                        this.userService.setUserPaymentCard(data.sources.data[0].id);
                        this.isCardSelected = true;
                        this.placeOrderIsDisabled = false;
                    } else {
                        this.isCardSelected = false;
                        this.placeOrderIsDisabled = true;
                    }
                });
                if (response.id) {
                    this.userService.hideAppSpinner();
                    $('[name=\'name\']').val('');
                    $('[name=\'number\']').val('');
                    $('[name=\'month\']').val('');
                    $('[name=\'zip\']').val('');
                    $('[name=\'cvv\']').val('');
                    $('#addnewcard .close').trigger('click');
                } else {
                    this.userService.hideAppSpinner();
                    window.scrollTo(0, 0);
                    // this.userService.showflashMessage('danger', response.raw.message);
                    this.showAddCardError(response.raw.message);
                }
            });
        }
    }


}