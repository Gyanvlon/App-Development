import { DynamicScriptLoaderService } from './../../shared/services/DynamicScriptLoader';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import { Observable } from 'rxjs/Rx';
import { UserService } from '../../shared/services/user.service';
import * as $ from 'jquery';
@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public loggedInUserData: Array<any> = this.userService.getCurrentUserData();
    public cartItems: Array<any> = [];
    public establishmentData: Array<any> = [];
    public establishmentDistance: any;
    public establishmentId: string = '';
    public userCurrentLocation: any = {};
    public userTravelMode: string = (this.userService.getUserTransportmode() == 0) ? 'walk' : 'drive';
    public taxBasedOnEstablishment: number = 0;
    public showEarnPointsText: boolean = true;
    public deliveryFee: number = 0;
    public tipAmount: any = '';
    public tipAmountToDisplay: any = 0;
    public isCartLoaded: boolean = false;
    public establishmentIdArray = [];
    public userDeliveryAddressToUse: Object = {};
    public isLocationEntered: boolean = false;
    public isCheckoutDisabled: boolean = false;
    public debounce: any;
    public establishment1 = [];
    public establishment2 = [];
    public establishmentIds: any;
    public deliveryMessage: any = {};
    public deliveryDate: any;
    public scriptLoaded = false;
    public notLoggedIn = false;
    public args: any;
    public deliveryMessages: any;
    public deiveryMsg: any;
    public est1Message: any;
    public est2Message: any;
    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router,
        private dynamicScriptLoader: DynamicScriptLoaderService

    ) { }

    ngOnInit() {
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse())
            ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation()
                && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});

        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.isLocationEntered = false;
            this.userService.setIsLocation(false);
        } else {
            this.isLocationEntered = true;
            this.userService.setIsLocation(true);
        }
        this.userService.setTipAmount(0);
        // this.tipAmount = this.userService.getTipAmount() == null || this.userService.getTipAmount() == 0 ? "" : this.userService.getTipAmount();
        // this.tipAmountToDisplay = this.userService.getTipAmount() == null ? 0 : this.userService.getTipAmount();
        this.userService.showAppSpinner();
        //this.refreshDeliveryFees();
        if (this.userService.isLoggedIn()) {
            this.isUserLoggedIn = true;
            this.ProviderServiceService.getUserDiscountInfo()
                .subscribe(data => {
                    // this.userService.setDiscountInfo(data.discountAmount);
                    this.userService.setDiscountInfo(
                        parseFloat((
                            (typeof data.est1 != 'undefined' ? parseFloat(data.est1.discountAmount) : 0.00)
                            +
                            (typeof data.est2 != 'undefined' ? parseFloat(data.est2.discountAmount) : 0.00)
                        ).toFixed(2))
                    );
                    this.userService.setDiscountJson(data);
                    if (data.discountAmount > 0) {
                        this.showEarnPointsText = false;
                    }
                });
        } else {
            this.isUserLoggedIn = false;
            this.userService.setDefaultDiscountJson();
        }
        this.fetchUserShoppingCartData(() => {
            setTimeout(() => {
                window.scrollTo(0, 0);
                this.userService.customScoll();
            }, 2000);

        });

    }
   
    public fetchUserShoppingCartData(callback) {
        if (this.userService.isLoggedIn()) {
            this.ProviderServiceService.getShoppingCart()
                .subscribe(data => {
                    this.ProviderServiceService.getUserDiscountInfo().subscribe(res => {
                        this.establishmentIds = res;
                        let est1 = (this.establishmentIds && this.establishmentIds.est1) ? this.establishmentIds.est1.establishmentId : '';
                        let est2 = (this.establishmentIds && this.establishmentIds.est2) ? this.establishmentIds.est2.establishmentId : '';

                        this.establishment1 = data.filter(d => d.establishmentId == est1);
                        this.establishment2 = data.filter(d => d.establishmentId == est2);
                        if (data.length == 1) {
                            if (this.establishmentIds.est1.deliveryDate === '') {
                                this.deliveryDate = {
                                    deliveryDate: this.establishmentIds.est2.deliveryDate,

                                }
                            }
                            else {
                                this.deliveryDate = {
                                    deliveryDate: this.establishmentIds.est1.deliveryDate
                                }
                            }
                        }
                        else {
                            this.deliveryDate = {
                                deliveryDate: this.establishmentIds.est1.deliveryDate,
                                otherDeliveryDate: this.establishmentIds.est2.deliveryDate
                            };
                        }
                        this.userService.setUserDeliveryDateTime(this.deliveryDate);


                        this.ProviderServiceService.getDeliveryFees().subscribe(res => {
                            this.deliveryMessage = res;
                            console.log(this.deliveryMessage);

                            this.userService.setShoppingCartData(data);
                            this.userService.setShoppingCartCount(data.length);
                            this.cartItems = data;
                            if (this.cartItems.length > 0) {
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
                                                this.isCartLoaded = true;
                                                callback();
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
                                   // console.log(this.establishmentId);
                                    this.ProviderServiceService.getEstablishmentDetails(this.establishmentId)
                                        .subscribe(data => {
                                            this.establishmentData = data;
                                            console.log(this.establishmentData);
                                            this.ProviderServiceService.getTaxFromLatLong(data.geoLocation.coordinates[1], data.geoLocation.coordinates[0], response => {
                                                // this.taxBasedOnEstablishment = parseFloat(response.combined_rate);
                                                let taxInfoJson = {
                                                    [data.id]: parseFloat(response.combined_rate)
                                                };
                                                this.userService.setTaxRate(taxInfoJson);
                                                this.refreshCart();
                                                this.isCartLoaded = true;
                                                callback();
                                            });
                                        });
                                }
                            } else {
                                this.isCartLoaded = true;
                                callback();
                            }
                        });
                    });
                });
        } else {
            this.notLoggedIn = true;
            

            let cartLocalStorage = this.userService.getCartLocalStorage();
            // this.cartItems = (cartLocalStorage) ? cartLocalStorage : [];
            // ----------------------------------------------------------------------------
            this.establishmentIds = (cartLocalStorage) ? cartLocalStorage : [];
            let est1;
            let est2;
            if (this.establishmentIds.length == 1) {
                est1 = this.establishmentIds[0].offer.establishmentId;
                this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
            } else if (this.establishmentIds.length == 0) {
                //nothing
            }
            else {
                est1 = this.establishmentIds[0].offer.establishmentId;
                this.establishmentIds.forEach(element => {
                    if (est1 == element.offer.establishmentId) {
                        est1 = element.offer.establishmentId;
                    }
                    else {
                        est2 = element.offer.establishmentId;
                        this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                        this.establishment2 = this.establishmentIds.filter(d => d.offer.establishmentId == est2);
                    }

                });
            }
            this.ProviderServiceService.getDeliveryMessage(est1).subscribe( res => {
                this.deiveryMsg = res;
                this.est1Message = JSON.parse(this.deiveryMsg._body);
                console.log(this.est1Message.deliveryMsg);

            });
            this.ProviderServiceService.getDeliveryMessage(est2).subscribe( res => {
                this.deiveryMsg = res;
                this.est2Message = JSON.parse(this.deiveryMsg._body);
                console.log(this.est2Message.deliveryMsg);

            });
            //------------------------------------------------------------------------------
            if (this.establishmentIds.length > 0) {
                this.establishmentData = this.establishmentIds[0].offer.establishment;
                this.userService.setCartEstablishmentId(this.establishmentIds[0].offer.establishmentId);

                this.establishmentId = this.userService.getCartEstablishmentId();
                this.ProviderServiceService.getEstablishmentDetails(this.establishmentId)
                    .subscribe(data => {
                        this.establishmentData = data;
                        this.ProviderServiceService.getTaxFromLatLong(data.geoLocation.coordinates[1], data.geoLocation.coordinates[0], response => {
                            this.userService.setTaxRate(response.combined_rate);
                            // this.taxBasedOnEstablishment = parseFloat(response.combined_rate);
                            this.refreshCart();
                            this.isCartLoaded = true;
                            // this.deliveryMessage = {"sanchit":"sahu"};
                            callback();
                        });
                    });
            } else {
                this.isCartLoaded = true;
                callback();
            }
        }
    }

    public removeFromCart(cartId: any) {
        if (confirm('Are you sure you want to remove this item? ')) {
            this.userService.showAppSpinner();
            if (this.userService.isLoggedIn()) {
                this.ProviderServiceService.removeItemShoppingCart(cartId)
                    .subscribe(data => {
                        if (data.count > 0) {
                            this.userService.showflashMessage('success', 'Item removed from cart successsfully');
                            this.ProviderServiceService.getShoppingCart()
                                .subscribe(data => {
                                    this.ProviderServiceService.getUserDiscountInfo().subscribe(res => {
                                        this.establishmentIds = res;
                                        let est1 = this.establishmentIds.est1.establishmentId;
                                        let est2 = this.establishmentIds.est2.establishmentId;

                                        this.establishment1 = data.filter(d => d.establishmentId == est1);
                                        this.establishment2 = data.filter(d => d.establishmentId == est2);

                                       
                                        if (data.length == 1) {
                                            if (this.establishmentIds.est1.deliveryDate === '') {
                                                this.deliveryDate = {
                                                    deliveryDate: this.establishmentIds.est2.deliveryDate,
                                                    otherDeliveryDate: ''

                                                }
                                            }
                                            else {
                                                this.deliveryDate = {
                                                    deliveryDate: this.establishmentIds.est1.deliveryDate,
                                                    otherDeliveryDate: ''

                                                }
                                            }
                                        } else {
                                            this.deliveryDate = {
                                                deliveryDate: this.establishmentIds.est1.deliveryDate,
                                                otherDeliveryDate: this.establishmentIds.est2.deliveryDate
                                            };
                                        }
                                        this.userService.setUserDeliveryDateTime(this.deliveryDate);
                                        this.ProviderServiceService.getDeliveryFees().subscribe(res => {
                                            this.deliveryMessage = res;

                                            this.ProviderServiceService.getUserDiscountInfo().subscribe(discountdata => {
                                                // this.userService.setDiscountInfo(discountdata.discountAmount);
                                                this.userService.setDiscountInfo(
                                                    parseFloat((
                                                        (typeof discountdata.est1 != 'undefined' ? parseFloat(discountdata.est1.discountAmount) : 0.00)
                                                        +
                                                        (typeof discountdata.est2 != 'undefined' ? parseFloat(discountdata.est2.discountAmount) : 0.00)
                                                    ).toFixed(2))
                                                );
                                                this.userService.setDiscountJson(discountdata);
                                                if (discountdata.discountAmount > 0) {
                                                    this.showEarnPointsText = false;
                                                }
                                                this.userService.setShoppingCartData(data);
                                                this.userService.setShoppingCartCount(data.length);
                                                this.cartItems = data;
                                                this.userService.setHeaderCartCheck(true);
                                                if (data.length > 0) {
                                                    this.establishmentData = data[0].offer.establishment;
                                                    this.userService.setCartEstablishmentId(data[0].offer.establishmentId);
                                                } else {
                                                    this.userService.unsetCartEstablishmentId();
                                                    this.userService.setDiscountInfo(0);
                                                    this.userService.setDefaultDiscountJson();
                                                }
                                                this.userService.hideAppSpinner();
                                                // this.userService.customScollOnRemove();
                                                window.scrollTo(0, 0);
                                                this.userService.customScoll();
                                            });
                                        });
                                    });
                                });
                        } else {
                            this.userService.showflashMessage('danger', 'Error occured while removing item', 15000);
                            window.scrollTo(0, 0);
                            this.userService.hideAppSpinner();
                            this.userService.customScoll();
                        }
                    });
                this.userService.customScollOnRemove();
            } else {
                this.deleteLocalCartData(cartId);
                this.userService.setDefaultDiscountJson();

                this.notLoggedIn = true;

                let cartLocalStorage = this.userService.getCartLocalStorage();
                // ----------------------------------------------------------------------------
                this.establishmentIds = (cartLocalStorage) ? cartLocalStorage : [];
                let est1;
                let est2;
                this.establishment1 = [];
                this.establishment2 = [];
                if (this.establishmentIds.length == 1) {
                    est1 = this.establishmentIds[0].offer.establishmentId;
                    this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                } else if (this.establishmentIds.length == 0) {
                    //nothing
                } else {
                    est1 = this.establishmentIds[0].offer.establishmentId;
                    this.establishmentIds.forEach(element => {
                        if (est1 == element.offer.establishmentId) {
                            est1 = element.offer.establishmentId;
                        } else {
                            est2 = element.offer.establishmentId;
                        }
                    });
                    this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                    this.establishment2 = this.establishmentIds.filter(d => d.offer.establishmentId == est2);
                }
               window.scrollTo(0, 0);
                this.userService.customScoll();
            }
        }
    }
    trackByFn(index: any, item: any) {
        return index;
    }
    quantityUpdated(args: any, cardId, val, i) {
        if (this.debounce) {
            clearTimeout(this.debounce);
        }
        if (args == null || args == '' || args <= 0) {
            $('[offerid="offer_' + cardId + '"]').val(null);
            this.isCheckoutDisabled = true;
            this.userService.showflashMessage('danger', 'Please enter valid quantity');
            return;
        } else {

            this.isCheckoutDisabled = false;
            this.debounce = setTimeout(() => {
                this.updateCartQuantityFromInput(i, cardId, val, args);
            }, 900);
        }
    }

    public updateCartQuantityFromInput(args, cartId: string, arrowType, updatedVal) {
        this.userService.showAppSpinner();
        let lastVal = $('#quantityItems' + args).val();
        let newVal = 0;
        if (arrowType == 'more') {
            newVal = parseInt(lastVal) + 1;
        } else if (arrowType == 'less') {
            newVal = parseInt(lastVal) - 1;
        } else if (arrowType == 'val') {
            // newVal = parseInt(lastVal);
            newVal = parseInt(updatedVal);
        }
        if (newVal > 0) {
            if (this.userService.isLoggedIn()) {
                // $('#quantityItems' + args).val(newVal);
                this.ProviderServiceService.updateShoppingCart(cartId, newVal)
                    .subscribe(data => {
                        this.ProviderServiceService.getShoppingCart()
                            .subscribe(data => {
                                this.ProviderServiceService.getUserDiscountInfo()
                                    .subscribe(discountdata => {
                                        // this.userService.setDiscountInfo(discountdata.discountAmount);
                                        this.userService.setDiscountInfo(
                                            parseFloat((
                                                (typeof discountdata.est1 != 'undefined' ? parseFloat(discountdata.est1.discountAmount) : 0.00)
                                                +
                                                (typeof discountdata.est2 != 'undefined' ? parseFloat(discountdata.est2.discountAmount) : 0.00)
                                            ).toFixed(2))
                                        );
                                        this.userService.setDiscountJson(discountdata);
                                        if (discountdata.discountAmount > 0) {
                                            this.showEarnPointsText = false;
                                        }
                                        this.userService.showflashMessage('success', 'Quantity has been updated successfully');
                                        this.userService.setShoppingCartData(data);
                                        this.userService.setShoppingCartCount(data.length);
                                        this.cartItems = data;
                                        if (data.length > 0) {
                                            this.establishmentData = data[0].offer.establishment;
                                            this.userService.setCartEstablishmentId(data[0].offer.establishmentId);
                                        } else {
                                            this.userService.unsetCartEstablishmentId();
                                        }
                                        this.refreshDeliveryFees();
                                        this.userService.hideAppSpinner();

                                        this.ProviderServiceService.getDeliveryFees().subscribe(res => {
                                            this.deliveryMessage = res;

                                        });
                                    });
                            });
                    });
            } else {
                $('#quantityItems' + args).val(newVal);
                this.ProviderServiceService.getOfferDetails(cartId)
                    .subscribe(data => {
                        let cartLocalData: any = {};
                        cartLocalData.offer = data[0];
                        cartLocalData.product = data[0].product;
                        cartLocalData.quantity = newVal;
                        delete cartLocalData.offer.product;
                        this.changeLocalCartQuantity(cartLocalData);
                        this.userService.setHeaderCartCheck(true);
                        this.userService.setDefaultDiscountJson();
                        this.userService.showflashMessage('success', 'Quantity has been updated successfully');
                        this.userService.hideAppSpinner();
                    });
            }

        } else {
            if (this.userService.isLoggedIn()) {
                this.ProviderServiceService.removeItemShoppingCart(cartId).subscribe(data => {
                    if (data.count > 0) {
                        this.userService.showflashMessage('success', 'Item has been removed from cart successsfully');
                        this.ProviderServiceService.getShoppingCart().subscribe(data => {
                            this.userService.setShoppingCartData(data);
                            this.userService.setShoppingCartCount(data.length);
                            this.cartItems = data;
                            if (data.length > 0) {
                                this.establishmentData = data[0].offer.establishment;
                                this.userService.setCartEstablishmentId(data[0].offer.establishmentId);
                            } else {
                                this.userService.unsetCurrentEstablishmentId();
                                this.userService.unsetCartEstablishmentId();
                            }
                            this.refreshDeliveryFees();
                            this.userService.hideAppSpinner();
                            window.scrollTo(0, 0);
                            this.userService.customScoll();
                        });
                    } else {
                        this.userService.showflashMessage('danger', 'Error occured while removing item', 15000);
                    }
                });
            } else {
                this.deleteLocalCartData(cartId);
                this.userService.setDefaultDiscountJson();

                this.notLoggedIn = true;

                let cartLocalStorage = this.userService.getCartLocalStorage();
                // ----------------------------------------------------------------------------
                this.establishmentIds = (cartLocalStorage) ? cartLocalStorage : [];
                let est1;
                let est2;
                this.establishment1 = [];
                this.establishment2 = [];
                if (this.establishmentIds.length == 1) {
                    est1 = this.establishmentIds[0].offer.establishmentId;
                    this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                } else if (this.establishmentIds.length == 0) {
                    //nothing
                } else {
                    est1 = this.establishmentIds[0].offer.establishmentId;
                    this.establishmentIds.forEach(element => {
                        if (est1 == element.offer.establishmentId) {
                            est1 = element.offer.establishmentId;
                        } else {
                            est2 = element.offer.establishmentId;
                        }
                    });
                    this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                    this.establishment2 = this.establishmentIds.filter(d => d.offer.establishmentId == est2);
                }
                this.userService.showflashMessage('success', 'Item has been removed from cart successsfully');
                window.scrollTo(0, 0);
                this.userService.customScoll();
            }
        }
        this.userService.setHeaderCartCheck(true);
    }
  public updateCartQuantity(args, cartId: string, arrowType) {
        this.userService.showAppSpinner();
        let lastVal = $(args.currentTarget).parents('.qty-input').find('.quantity-input').val();
        let newVal = 0;
        if (arrowType == 'more') {
            newVal = parseInt(lastVal) + 1;
        } else if (arrowType == 'less') {
            newVal = parseInt(lastVal) - 1;
        } else if (arrowType == 'val') {
            newVal = parseInt(lastVal);
        }
        if (newVal > 0) {
            if (this.userService.isLoggedIn()) {
                $(args.currentTarget).parents('.qty-input').find('.quantity-input').val(newVal);
                this.ProviderServiceService.updateShoppingCart(cartId, newVal)
                    .subscribe(data => {
                        this.ProviderServiceService.getShoppingCart()
                            .subscribe(data => {
                                this.ProviderServiceService.getUserDiscountInfo().subscribe(res => {
                                    this.establishmentIds = res;
                                    let est1 = this.establishmentIds.est1.establishmentId;
                                    let est2 = this.establishmentIds.est2.establishmentId;

                                    this.establishment1 = data.filter(d => d.establishmentId == est1);
                                    this.establishment2 = data.filter(d => d.establishmentId == est2);

                                });

                                this.ProviderServiceService.getDeliveryFees().subscribe(res => {
                                    this.deliveryMessage = res;

                                });

                                this.ProviderServiceService.getUserDiscountInfo()
                                    .subscribe(discountdata => {
                                        // this.userService.setDiscountInfo(discountdata.discountAmount);
                                        this.userService.setDiscountInfo(
                                            parseFloat((
                                                (typeof discountdata.est1 != 'undefined' ? parseFloat(discountdata.est1.discountAmount) : 0.00)
                                                +
                                                (typeof discountdata.est2 != 'undefined' ? parseFloat(discountdata.est2.discountAmount) : 0.00)
                                            ).toFixed(2))
                                        );
                                        this.userService.setDiscountJson(discountdata);
                                        if (discountdata.discountAmount > 0) {
                                            this.showEarnPointsText = false;
                                        }
                                        this.userService.showflashMessage('success', 'Quantity has been updated successfully');
                                        this.userService.setShoppingCartData(data);
                                        this.userService.setShoppingCartCount(data.length);
                                        this.cartItems = data;
                                        if (data.length > 0) {
                                            this.establishmentData = data[0].offer.establishment;
                                            this.userService.setCartEstablishmentId(data[0].offer.establishmentId);
                                        } else {
                                            this.userService.unsetCartEstablishmentId();
                                        }
                                        this.refreshDeliveryFees();
                                        this.userService.hideAppSpinner();
                                    });
                            });
                    });
            } else {
                $(args.currentTarget).parents('.qty-input').find('.quantity-input').val(newVal);
                this.ProviderServiceService.getOfferDetails(cartId)
                    .subscribe(data => {
                        let cartLocalData: any = {};
                        cartLocalData.offer = data[0];
                        cartLocalData.product = data[0].product;
                        cartLocalData.quantity = newVal;
                        delete cartLocalData.offer.product;
                        this.changeLocalCartQuantity(cartLocalData);

                        let cartLocalStorage = this.userService.getCartLocalStorage();
                        // ----------------------------------------------------------------------------
                        this.establishmentIds = (cartLocalStorage) ? cartLocalStorage : [];
                        let est1;
                        let est2;
                        this.establishment1 = [];
                        this.establishment2 = [];
                        if (this.establishmentIds.length == 1) {
                            est1 = this.establishmentIds[0].offer.establishmentId;
                            this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                        } else if (this.establishmentIds.length == 0) {
                            //nothing
                        } else {
                            est1 = this.establishmentIds[0].offer.establishmentId;
                            this.establishmentIds.forEach(element => {
                                if (est1 == element.offer.establishmentId) {
                                    est1 = element.offer.establishmentId;
                                } else {
                                    est2 = element.offer.establishmentId;
                                }
                            });
                            this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                            this.establishment2 = this.establishmentIds.filter(d => d.offer.establishmentId == est2);
                            // est2 = this.esablishmentIds[1].offer.establishmentId;

                        }
                        this.userService.setHeaderCartCheck(true);
                        this.userService.setDefaultDiscountJson();
                        this.userService.showflashMessage('success', 'Quantity has been updated successfully');
                        this.userService.hideAppSpinner();
                    });
            }

        } else {
            if (this.userService.isLoggedIn()) {
                this.ProviderServiceService.removeItemShoppingCart(cartId)
                    .subscribe(data => {
                        if (data.count > 0) {
                            this.userService.showflashMessage('success', 'Item has been removed from cart successsfully');
                            this.ProviderServiceService.getShoppingCart()
                                .subscribe(data => {
                                    this.ProviderServiceService.getUserDiscountInfo()
                                        .subscribe(discountdata => {
                                            this.establishmentIds = discountdata;
                                            let est1 = this.establishmentIds.est1.establishmentId;
                                            let est2 = this.establishmentIds.est2.establishmentId;
                                            console.log('combined id', est1, est2);
                                            this.establishment1 = data.filter(d => d.establishmentId == est1);
                                            this.establishment2 = data.filter(d => d.establishmentId == est2);

                                            // this.userService.setDiscountInfo(discountdata.discountAmount);
                                            this.userService.setDiscountInfo(
                                                parseFloat((
                                                    (typeof discountdata.est1 != 'undefined' ? parseFloat(discountdata.est1.discountAmount) : 0.00)
                                                    +
                                                    (typeof discountdata.est2 != 'undefined' ? parseFloat(discountdata.est2.discountAmount) : 0.00)
                                                ).toFixed(2))
                                            );
                                            this.userService.setDiscountJson(discountdata);
                                            if (discountdata.discountAmount > 0) {
                                                this.showEarnPointsText = false;
                                            }
                                            this.userService.setShoppingCartData(data);
                                            this.userService.setShoppingCartCount(data.length);
                                            this.cartItems = data;
                                            if (data.length > 0) {
                                                this.establishmentData = data[0].offer.establishment;
                                                this.userService.setCartEstablishmentId(data[0].offer.establishmentId);
                                            } else {
                                                this.userService.unsetCurrentEstablishmentId();
                                                this.userService.unsetCartEstablishmentId();
                                            }
                                            this.refreshDeliveryFees();
                                            this.userService.hideAppSpinner();
                                            window.scrollTo(0, 0);
                                            this.userService.customScoll();
                                        });
                                });

                        } else {
                            this.userService.showflashMessage('danger', 'Error occured while removing item', 15000);
                        }
                    });
                this.userService.setHeaderCartCheck(true);
            } else {
                this.deleteLocalCartData(cartId);
                this.userService.setDefaultDiscountJson();

                this.notLoggedIn = true;

                let cartLocalStorage = this.userService.getCartLocalStorage();
                // ----------------------------------------------------------------------------
                this.establishmentIds = (cartLocalStorage) ? cartLocalStorage : [];
                let est1;
                let est2;
                this.establishment1 = [];
                this.establishment2 = [];
                if (this.establishmentIds.length == 1) {
                    est1 = this.establishmentIds[0].offer.establishmentId;
                    this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                } else if (this.establishmentIds.length == 0) {
                    //nothing
                } else {
                    est1 = this.establishmentIds[0].offer.establishmentId;
                    this.establishmentIds.forEach(element => {
                        if (est1 == element.offer.establishmentId) {
                            est1 = element.offer.establishmentId;
                        } else {
                            est2 = element.offer.establishmentId;
                        }
                    });
                    this.establishment1 = this.establishmentIds.filter(d => d.offer.establishmentId == est1);
                    this.establishment2 = this.establishmentIds.filter(d => d.offer.establishmentId == est2);
                    // est2 = this.esablishmentIds[1].offer.establishmentId;

                }
                // // this.establishment1 = this.esablishmentIds[0];
                // console.log(this.establishment1);
                // // this.establishment2 = this.esablishmentIds[1];
                // console.log(this.establishment2);
                this.userService.showflashMessage('success', 'Item has been removed from cart successsfully');
                window.scrollTo(0, 0);
                this.userService.customScoll();

            }
        }
    }

    changeLocalCartQuantity(cartLocalData) {
        let localCartData = this.userService.getCartLocalStorage();
        let itemFound = false;
        localCartData.forEach(cartItem => {
            if (cartItem.offer.id == cartLocalData.offer.id && itemFound == false) {
                itemFound = true;
                cartItem.quantity = cartLocalData.quantity;
            }
        });
        if (!itemFound) {
            this.userService.setCartLocalStorage(cartLocalData);
        } else {
            this.userService.replaceCartLocalStorage(localCartData);
        }
        this.cartItems = this.userService.getCartLocalStorage();
    }

    deleteLocalCartData(offerId: string) {
        let localCartData = this.userService.getCartLocalStorage();
        let itemFound = false;
        let index = localCartData.length - 1;

        while (index >= 0) {
            if (localCartData[index].offer.id === offerId) {
                localCartData.splice(index, 1);
            }

            index -= 1;
        }

        this.userService.replaceCartLocalStorage(localCartData);
        this.cartItems = this.userService.getCartLocalStorage();
        this.userService.setHeaderCartCheck(true);
        this.userService.hideAppSpinner();
    }

    applyPromocode(args) {
        if (this.userService.isLoggedIn()) {
            let promocode: string = '';
            if ($(args.currentTarget).parent().prev().find('input').val() != '') {
                promocode = $(args.currentTarget).parent().prev().find('input').val();
            }
            this.ProviderServiceService.getUserDiscountInfo(promocode)
                .subscribe(data => {
                    this.userService.unsetDiscountInfo();
                    this.userService.setDefaultDiscountJson();
                    if ((typeof data.est1 != 'undefined' && data.est1.discountAmount == 0) && (typeof data.est2 != 'undefined' && data.est2.discountAmount == 0)) {
                        this.userService.unsetDiscountInfo();
                    } else {
                        // this.userService.setDiscountInfo(data.discountAmount);
                        this.userService.setDiscountInfo(
                            parseFloat((
                                (typeof data.est1 != 'undefined' ? parseFloat(data.est1.discountAmount) : 0.00)
                                +
                                (typeof data.est2 != 'undefined' ? parseFloat(data.est2.discountAmount) : 0.00)
                            ).toFixed(2))
                        );
                        this.userService.setDiscountJson(data);
                        this.showEarnPointsText = false;
                    }
                    if (typeof data.est1 != 'undefined' && data.est1.discountAmount != 0) {
                        this.showPromocodeError(data.est1.discountUsed);
                    } else if (typeof data.est2 != 'undefined' && data.est2.discountAmount != 0) {
                        this.showPromocodeError(data.est2.discountUsed);
                    } else {
                        this.showPromocodeError(data.est1.discountUsed);
                    }
                    // if (data.discountUsed == "NA") {
                    //     this.showPromocodeError("No Discount Applied");
                    // } else {
                    //     this.showPromocodeError(data.discountUsed);
                    // }

                    this.refreshCart();
                    this.userService.hideAppSpinner();
                });
        } else {
            this.showPromocodeError('Please login to apply promo code');
            this.userService.unsetDiscountInfo();
            this.userService.setDefaultDiscountJson();
            this.refreshCart();
            this.userService.hideAppSpinner();
        }
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

    refreshDeliveryFees() {
        this.ProviderServiceService.getDeliveryFees()
            .subscribe(data => {
                // this.userService.setDeliveryFee(data.deliveryFee); sanchit
                this.userService.setDeliveryFee(
                    parseFloat((parseFloat(data.est1.deliveryFee) + parseFloat(data.est2.deliveryFee)).toFixed(2))
                );
                this.deliveryFee = this.userService.getDeliveryFee();
            });
    }

    showPromocodeError(message: string, success: boolean = false) {
        $('#promocodeError').text(message).removeClass('hidden');
        if (success == false) {
            let promocodeErrorTimer = setInterval(function () {
                clearInterval(promocodeErrorTimer);
                $('#promocode').val('');
                $('#promocodeError').text('').addClass('hidden');
            }, 60000);
        } else {

        }
    }

    clearPromocode(args: any) {
        $('#promocode').val('');
        if (this.userService.isLoggedIn()) {
            this.ProviderServiceService.getUserDiscountInfo()
                .subscribe(data => {
                    this.userService.unsetDiscountInfo();
                    this.userService.setDefaultDiscountJson();
                    if (data.discountAmount == 0) {
                        this.userService.unsetDiscountInfo();
                    } else {
                        // this.userService.setDiscountInfo(data.discountAmount);
                        this.userService.setDiscountInfo(
                            parseFloat((
                                (typeof data.est1 != 'undefined' ? parseFloat(data.est1.discountAmount) : 0.00)
                                +
                                (typeof data.est2 != 'undefined' ? parseFloat(data.est2.discountAmount) : 0.00)
                            ).toFixed(2))
                        );
                        this.userService.setDiscountJson(data);
                        this.showEarnPointsText = false;
                    }
                    this.refreshCart();
                    this.userService.hideAppSpinner();
                });
        }
        $('#promocodeError').text('').addClass('hidden');

    }

    updateTipAmount(args: any) {
        let val = String($('#tipAmount').val());
        if (val) {
            if (val.indexOf('.') > -1) {
                if (val.length > 5) {
                    val = val.substring(0, 5);
                    args = +val;
                } else if (val.length < 5) {
                    // for safari issue
                    args = $('#tipAmount').val();
                }
            } else {
                if (val.length > 4) {
                    args = Math.floor(args / 1e1);
                }
            }

        }
        if (args == null || args < 0 || isNaN(args)) {
            args = '';
            this.tipAmountToDisplay = 0;
            this.tipAmount = '';
            $('#tipAmount').val('');
        } else {
            $('#tipAmount').val(args);
            this.tipAmountToDisplay = args;
            this.tipAmount = args;
        }

        this.userService.setTipAmount(parseFloat(args == '' ? 0 : args));
    }


    goToCartDelivery() {
        if (this.userService.isLoggedIn()) {
            this.ProviderServiceService.getDeliveryFees()
                .subscribe(data => {
                    this.userService.setDeliveryFee(
                        parseFloat((parseFloat(data.est1.deliveryFee) + parseFloat(data.est2.deliveryFee)).toFixed(2))
                    );
                    this.deliveryFee = this.userService.getDeliveryFee();
                    if (typeof data.est1 != 'undefined' && typeof data.est2 != 'undefined' && data.est1.proceedToCheckout && data.est2.proceedToCheckout) {
                        this.router.navigate(['/cart-placeorder']);
                    } else if (typeof data.est1 != 'undefined' && !data.est1.proceedToCheckout) {
                        window.scrollTo(0, 0);
                        this.userService.showflashMessage('danger', data.est1.message, 15000);
                    } else if (typeof data.est2 != 'undefined' && !data.est2.proceedToCheckout) {
                        window.scrollTo(0, 0);
                        this.userService.showflashMessage('danger', data.est2.message, 15000);
                    }
                });
        } else {
            this.router.navigate(['/logincheckout']);
        }

    }

}
