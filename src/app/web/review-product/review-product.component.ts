import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { Angulartics2 } from 'angulartics2';

@Component({
    selector: 'app-review-product',
    templateUrl: './review-product.component.html',
    styleUrls: ['./review-product.component.css']
})
export class ReviewProductComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public accountData: Array<any>;
    public orderDetails: Array<any>;
    public orderData: Array<any>;
    public carouselOptions: any = {
        items: 2,
        dots: false,
        nav: true,
        navText: ['<i class=\'fa fa fa-angle-left\' aria-hidden=\'true\'></i>', '<i class=\'fa fa fa-angle-right\' aria-hidden=\'true\'></i>']
    }

    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router,
        private angulartics2: Angulartics2
    ) { }

    ngOnInit() {
        this.userService.showAppSpinner();
        this.route.params
            .subscribe(params => {
                this.ProviderServiceService.getOrderDetails(params.orderId)
                    .subscribe(data => {
                        data = data[0];
                        this.orderData = data;
                        this.accountData = data.account;
                        this.orderDetails = data.orderdetails;
                        if (this.orderDetails.length > 1) {
                            this.carouselOptions.items = 2;
                        } else {
                            this.carouselOptions.items = 1;
                        }
                        delete this.orderData['account'];
                        delete this.orderData['establishment'];
                        delete this.orderData['orderdetails'];
                        this.userService.hideAppSpinner();
                    });
            });
    }

    submitRating(args, productId: string) {
        this.userService.showAppSpinner();
        this.angulartics2.eventTrack.next({
            action: 'Rate',
            properties: {
                category: 'Rate',
                label: 'action',
                value: 'User rated the product',
                productId: productId
            },
        });
        this.ProviderServiceService.submitProductRating(args.rating, productId)
            .subscribe(data => {
                this.userService.hideAppSpinner();
            });
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

}
