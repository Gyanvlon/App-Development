import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import { UserService } from '../../shared/services/user.service';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common'
import { Angulartics2 } from 'angulartics2';
import { BRANCH_LINK } from '../../constants/constants';
import * as $ from 'jquery';
@Component({
    selector: 'app-checkout-summary',
    templateUrl: './checkout-summary.component.html',
    styleUrls: ['./checkout-summary.component.css']
})
export class CheckoutSummaryComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public accountData: Array<any>;
    public establishmentData: Array<any>;
    public orderDetails: Array<any>;
    public orderData: Array<any>;
    public establishmentLatitude: string;
    public establishmentLongitude: string;
    public zoom: number = 16;
    public userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    public branchLink: string = BRANCH_LINK;
    public userSavedCards: Array<any> = [];
    public selectedCardData: Array<any> = [];
    public isMultiple: boolean = false
    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private router: Router,
        location: PlatformLocation,
        private angulartics2: Angulartics2
    ) {
        location.onPopState(() => {
            this.router.navigate(['/productlisting']);
        });
    }
    ngOnInit() {
        this.userService.showAppSpinner();
        this.route.params
            .subscribe(params => {
                if (params.orderId == 1) {
                    this.setDataForMultipleOrders(params);
                } else {
                    this.setDataforSingleOrder(params);
                }
            });
    }
    setDataForMultipleOrders(params) {
        this.isMultiple = true;
        this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
            .subscribe(data => {
                this.ProviderServiceService.emptyShoppingCart(1)
                    .subscribe(data => {
                        this.userService.setHeaderCartCheck(true);
                    });
                this.orderData = data;
                this.userService.hideAppSpinner();
            });
    }
    setDataforSingleOrder(params) {
        this.isMultiple = false;
        this.angulartics2.eventTrack.next({
            action: 'Purchase',
            properties: {
                category: 'Purchase',
                label: 'action',
                value: 'User Completed the Purchase',
                orderId: params.orderId
            },
        });
        this.ProviderServiceService.getOrderDetails(params.orderId)
            .subscribe(data => {
                this.ProviderServiceService.emptyShoppingCart(1)
                    .subscribe(data => {
                        this.userService.setHeaderCartCheck(true);
                    });
                data = data[0];
                this.orderData = data;
                this.userService.hideAppSpinner();
            });
        this.userService.hideAppSpinner();
        }

    public logError(error: Error): void {
        console.group('Clipboard Error');
        console.error(error);
        console.groupEnd();
    }
    public logSuccess(value: string): void {
        console.group('Clipboard Success');
        $('#copyText').text('Copied');
        console.groupEnd();
    }
    viewReceipt(orderId: string, myOrderState: string) {
        this.userService.setMyOrderState(myOrderState);
        this.router.navigate(['/view-receipt', orderId]);
    }
    print(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
        <html>
            <head>
                <title>Print tab</title>
                <style>
                    .profilepage .container {
                        max-width: 970px;
                    }
                    .receipt-titles {
                        margin-right: -35px;
                    }
                    .receipt-table.table>tbody>tr>td {
                        vertical-align: middle;
                    }
                    .receipt-table2 {
                        width: 250px;
                        margin-left: auto;
                        color: #8D8D8D;
                        text-transform: capitalize;
                    }
                    .receipt-table2 .color {
                        color: #000;
                        padding-bottom: 25px;
                    }
                    .review-products {
                        text-align: center;
                    }
                    .review-products h4 {
                        font-family: 'DirectorsGothic230';
                        font-size: 36px;
                        color: #000000;
                        margin-top: 45px;
                    }
                    .review-p-text {
                        font-size: 14px;
                    }
                    .review-flex {
                        margin-top: 40px;
                    }
                    .review-01 {
                        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                        border-radius: 15px;
                        border: 1px solid #E8E3D9;
                        background-color: #FFFFFF;
                        padding: 10px 10px 20px;
                        margin-bottom: 30px;
                    }
                    .review-01 img {
                        height: 265px;
                        width: auto;
                    }
                    .review-01 h5 {
                        font-size: 18px;
                        color: #000000;
                        font-weight: 600;
                        margin-top: 5px;
                        margin-bottom: 5px;
                    }
                    .review-01 p {
                        font-size: 12px;
                    }
                    /*************************************
                        Star reviewing
                    **************************************/
                    div.stars {
                        width: auto;
                        display: inline-block;
                    }
                    input.star {
                        display: none;
                    }
                    label.star {
                        float: right;
                        padding: 3px;
                        font-size: 24px;
                        color: #9D2480;
                        transition: all .2s;
                        cursor: pointer;
                    }
                    input.star:checked~label.star:before {
                        content: '\f005';
                        color: #9D2480;
                        transition: all .25s;
                    }
                    input.star-5:checked~label.star:before {
                        color: #9D2480;
                        text-shadow: 0 0 20px #9D2480;
                    }
                    input.star-1:checked~label.star:before {
                        color: #F62;
                    }
                    label.star:hover {
                        transform: scale(1.3);
                    }
                    label.star:before {
                        content: '\f006';
                        font-family: FontAwesome;
                    }
                    .btn-thanks {
                        margin-top: 40px;
                        font-size: 36px;
                        font-family: 'DirectorsGothic230';
                        width: auto;
                        padding: 4px 22px;
                        border-radius: 15px;
                        line-height: 45px;
                    }
                    .receipt-table:first-child.table>tbody>tr>td {
                        min-width: 50px;
                    }
                    * {
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        -o-box-sizing: border-box;
                        -ms-box-sizing: border-box;
                        box-sizing: border-box;
                    }
                    .account-info-box {
                        border: 2px solid #E8E3D9;
                        border-radius: 15px;
                        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                        font-size: 14px;
                        max-width: 615px;
                        margin: 20px auto;
                        padding: 20px 55px;
                    }
                    .profilepage .container {
                        margin: 0 auto;
                    }
                    .viewreceipt .order-num {
                        font-size: 18px;
                        padding-bottom: 15px;
                    }
                    .viewreceipt .title {
                        font-size: 18px;
                        font-weight: bold;
                        line-height: 24px;
                        margin: 0;
                    }
                    .viewreceipt .address {
                        font-size: 14px;
                        color: #898989;
                        padding-bottom: 20px;
                        margin: 10px 0 0 0;
                    }
                    .row {
                        margin-left: -15px;
                        margin-right: -15px;
                    }
                    .col-md-3 {
                        width: 25%;
                        padding-left: 15px;
                        padding-right: 15px;
                        float: left;
                    }
                    .viewreceipt .title-4 {
                        font-size: 14px;
                        color: #898989;
                        font-weight: 300;
                        margin-bottom: 0;
                    }
                    .viewreceipt .cont-4 {
                        font-size: 14px;
                        color: #000;
                        min-height: 36px;
                        font-weight: 500;
                        margin: 0 0 20px 0;
                    }
                    .viewreceipt .title-4 a {
                        font-weight: 600;
                        font-size: 13px;
                        color: #3878DE;
                        text-decoration: none;
                        display: none;
                    }
                    .viewreceipt .orders {
                        font-size: 18px;
                        padding-top: 25px;
                        clear: left;
                    }
                    .table-responsive {
                        min-height: .01%;
                        overflow-x: auto;
                    }
                    .table {
                        width: 100%;
                        max-width: 100%;
                        margin-bottom: 20px;
                    }
                    .receipt-table th {
                        font-size: 14px;
                        font-weight: normal;
                        padding: 5px 0;
                        vertical-align: middle;
                    }
                    .receipt-table:first-child.table>tbody>tr>td {
                        min-width: 50px;
                    }
                    .receipt-table.table>tbody>tr>td {
                        vertical-align: middle;
                    }
                    .receipt-table.table tr th {
                        padding: 8px;
                        text-align: left;
                    }
                    .receipt-table.table tr td {
                        padding: 8px;
                    }
                    .receipt-table2 {
                        width: 250px;
                        margin-left: auto;
                        color: #8D8D8D;
                        text-transform: capitalize;
                    }
                    .tab-right {
                        text-align: right;
                        padding-right: 60px !important;
                    }
                    .col-primary {
                        color: #9D2480 !important;
                    }
                    ::placeholder {
                        color: #BBB4A7 !important;
                        opacity: 1;
                    }
                    ::after, ::before {
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                    }
                    .receipt-table:last-child.table>tbody>tr:nth-last-of-type(2)>td {
                        border-top: 0.5px solid #E8E3D9;
                    }
                    .viewreceipt .payment {
                        font-size: 14px;
                        padding-top: 20px;
                        text-align: center;
                    }
                    .receipt-logo {
                        text-align: center;
                        width: 100px;
                        margin: 0 auto;
                    }
                    .receipt-logo img {
                        width: 100%;
                    }
                    .receipt-logo a {
                        display: inline-block;
                        vertical-align: top;
                    }
                    .receipt-table img {
                        width: 22px;
                        height: 80px;
                        object-fit: cover;
                    }
                </style>
            </head>
            <body onload="window.print();window.close()">
                <img src="https://getbevvi.com/assets/images/logo.png" style="width: auto;height: 50px;"/>
                <br>
                ${printContents}
            </body>
        </html>`
        );
        popupWin.document.close();
    }
}
