import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import { UserService } from '../../shared/services/user.service';
import { Angulartics2Facebook } from 'angulartics2/facebook';
import * as $ from 'jquery';

@Component({
    selector: 'app-productdetail',
    templateUrl: './productdetail.component.html',
    styleUrls: ['./productdetail.component.css']
})

export class ProductdetailComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public loggedinUserData: object = {};
    public productData: any = {};
    public establishmentData: Array<any> = [];
    public currentofferId: string = '';
    public offerData: Array<any> = [];
    public addToCartObj: any = {};
    public cartQuantity: number = 0;
    public userATCBtn: Array<any>;
    private isInputDisabled: boolean = false;
    private isQuantityLessDisabled: boolean = false;
    private isQuantityMoreDisabled: boolean = false;
    public breadcumbProductCategory = '';
    public userDeliveryAddress: Array<any> = (this.userService.getuserDeliveryLocation()) ? this.userService.getuserDeliveryLocation() : [];
    public isProductDataLoaded: boolean = false;
    public quantityItem: number = 1;
    public isSameProductExist: boolean = false;
    public estID: any;
    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private Angulartics2Facebook: Angulartics2Facebook
    ) {
        this.userService.showAppSpinner();
        this.route.params
            .subscribe(params => {
                this.currentofferId = params.offerId;
                this.breadcumbProductCategory = (params.cat);
                this.ProviderServiceService.getOfferDetails(params.offerId)
                    .subscribe(data => {
                        $('.form-control.text-qty-input1').val(1);
                        this.productData = data[0].product;                       
                        this.productData.tmpCount = 1;
                        this.establishmentData = data[0].establishment;
                        this.estID =  this.establishmentData['id'];
                        this.offerData = data[0];
                        this.productData.loaded = false;
                        this.addToCartObj = {
                            'accountId': this.userService.getCurrentAccountId(),
                            'productId': this.productData['id'],
                            'offerId': this.offerData['id'],
                            'establishmentId': this.establishmentData['id']
                        }
                         this.Angulartics2Facebook.eventTrack('ViewContent', {
                            content_name: this.productData['name'],
                            content_category: this.productData['category'],
                            content_ids: [this.offerData['id']],
                            content_type: 'product',
                            value: this.offerData['salePrice'],
                            currency: 'USD'
                        });
                        this.isProductDataLoaded = true;
                        this.userService.hideAppSpinner();
                    });
            });
    }

    ngOnInit() {
        if (this.isUserLoggedIn) {
            this.loggedinUserData = this.userService.getCurrentUserData();
        }
    }

    public changeQuantity(args) {
        let val = parseInt($('.qty-input input').val());

        if ($(args.currentTarget).hasClass('less')) {
            --val;
        } else if ($(args.currentTarget).hasClass('more')) {
            ++val;
        }

        if (val < 1) {
            val = 1;
        } else if (val > this.offerData['remQty']) {
            val = this.offerData['remQty'];
        }

        this.checkQuantity(val);
        $('.qty-input input').val(val);
    }

    public checkQuantity(currentVal: number) {
        if (currentVal == this.offerData['remQty']) {
            this.isQuantityLessDisabled = false;
            this.isQuantityMoreDisabled = true;
        } else {
            this.isQuantityLessDisabled = false;
            this.isQuantityMoreDisabled = false;
        }
    }

    public modalAddToCart(args) {
        if (this.quantityItem == null || this.quantityItem < 0) {
            return;
        }
        this.userService.showAppSpinner();
        this.userATCBtn = args.currentTarget;
        let cartData = this.addToCartObj;
        cartData.quantity = parseInt($('input[name=\'quantity\']').val());

        this.Angulartics2Facebook.eventTrack('AddToCart', {
            content_name: this.productData['name'],
            content_category: this.productData['category'],
            content_ids: [this.offerData['id']],
            content_type: 'product',
            value: this.offerData['salePrice'],
            currency: 'USD'
        });
        if ($(args.currentTarget).text() == 'ADD') {
            $('#addToCart').text('ADDED').attr('style', 'background: #D3832B !important').removeClass('atc-btn').addClass('atc-btn1');
            this.isInputDisabled = true;
            setTimeout(data => {
                this.isInputDisabled = false;
                $('#addToCart').text('UPDATE CART');
                $('#addToCart').attr('style', 'background: #D3832B !important');
                $('#addToCart').removeClass('atc-btn1').addClass('atc-btn');
            }, 3000)

        }
        else if ($(args.currentTarget).text() == 'UPDATE CART') {
            $(args.currentTarget).text('UPDATED')
            $(args.currentTarget).removeClass('atc-btn').addClass('atc-btn1');
            this.isInputDisabled = true;
            setTimeout(data => {
                this.isInputDisabled = false;
                $('#addToCart').text('UPDATE CART')
                $('#addToCart').removeClass('atc-btn1').addClass('atc-btn');
            }, 3000)
        }
        if ($(args.currentTarget).text() == 'ADD TO CART') {
            $(args.currentTarget).text('ADDED')
            $(args.currentTarget).removeClass('atc-btn').addClass('atc-btn1');
            this.isInputDisabled = true;
            setTimeout(data => {
                this.isInputDisabled = false;
                $(this.userATCBtn).text('UPDATE CART')
                $(this.userATCBtn).removeClass('atc-btn1').addClass('atc-btn');
            }, 3000)
        } else if ($(args.currentTarget).text() == 'UPDATE CART') {
            $(args.currentTarget).text('UPDATED')
            $(args.currentTarget).removeClass('atc-btn').addClass('atc-btn1');
            this.isInputDisabled = true;
            setTimeout(data => {
                this.isInputDisabled = false;
                $(this.userATCBtn).text('UPDATE CART')
                $(this.userATCBtn).removeClass('atc-btn1').addClass('atc-btn');
            }, 3000)
        }

        if (this.userService.isLoggedIn()) {
            this.ProviderServiceService.addToShoppingCart(cartData)
                .subscribe(data => {
                    this.ProviderServiceService.getShoppingCart()
                        .subscribe(data => {
                            this.userService.setShoppingCartData(data);
                            this.ProviderServiceService.getShoppingCartCount()
                                .subscribe(data => {
                                    this.userService.setShoppingCartCount(data.count);
                                    this.userService.setHeaderCartCheck(true);
                                    this.userService.hideAppSpinner();
                                });
                        });
                });
        } else {
            this.ProviderServiceService.getOfferDetails(cartData.offerId)
                .subscribe(data => {
                    let cartLocalData: any = {};
                    cartLocalData.offer = data[0];
                    cartLocalData.product = data[0].product;
                    cartLocalData.quantity = cartData.quantity;
                    delete cartLocalData.offer.product;
                    this.changeLocalCartQuantity(cartLocalData);
                    this.userService.setHeaderCartCheck(true);
                    this.userService.hideAppSpinner();
                });
                 }
            }

    public addToShoppingCart(args) {
        let localStorageCartData: any = [];
        if (this.userService.isLoggedIn()) {
            localStorageCartData = JSON.parse(localStorage.getItem('shoppingCartData'));
        } else {
            localStorageCartData = JSON.parse(localStorage.getItem('cartLocalStorage'));
        }
        if (localStorageCartData == null || localStorageCartData.length == 0) {
            
            this.modalAddToCart(args);
        } else {
          
            localStorageCartData.forEach(data => {
                if (this.userService.isLoggedIn()) {
                    if (this.addToCartObj.establishmentId == data.establishmentId) {
                        this.isSameProductExist = true;
                    }
                } else {
                    if (this.addToCartObj.establishmentId == data.offer.establishmentId) {
                        this.isSameProductExist = true;
                    }
                }
            });

            if (this.isSameProductExist == true) {
                this.modalAddToCart(args);
            } else {
                let added = false;
               
                this.userService.setSameVendorExist('true');
                setInterval(() => {
                    if (this.userService.getSameVendorExist() == 'true') {
                        this.userService.setSameVendorExist('false');                       
                        setTimeout(function () {
                            document.getElementById('vendorPopup').click();
                            added = true;
                            this.modalAddToCart(args);
                        }, 100);
                    }
                }, 1500);
            }
        }

    }
    updateQuantity(args: any) {       
        this.quantityItem = null;
        if (args == null || args < 0 || !Number.isInteger(args)) {
            $('input[name=\'quantity\']').val(null);
            this.quantityItem = null;           
        } else {
            this.quantityItem = args;
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
    }
}
