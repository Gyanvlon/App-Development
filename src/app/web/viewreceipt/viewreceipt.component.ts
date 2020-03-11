import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ProviderServiceService } from "../../../app/shared/services/provider-service.service";
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import * as $ from "jquery";

@Component({
    selector: 'app-viewreceipt',
    templateUrl: './viewreceipt.component.html',
    styleUrls: ['./viewreceipt.component.css']
})
export class ViewreceiptComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public accountData: Array<any>;
    public establishmentData: Array<any>;
    public orderDetails: Array<any>;
    public orderData: Array<any> = [];
    public transactionData: Array<any>;
    public paymentData: Array<any>;
    public establishmentLatitude: string;
    public establishmentLongitude: string;
    public discountAmount: number = 0;
    public userTimezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    public orderId: string = "";
    public isReceiptDataLoaded: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
        this.userService.showAppSpinner();
        this.route.params
            .subscribe(params => {
                this.orderId = params.orderId;
                this.ProviderServiceService.getOrderDetails(params.orderId)
                    .subscribe(data => {
                        data = data[0];
                        this.orderData = data;
                        this.accountData = data.account;
                        this.establishmentData = data.establishment;
                        this.orderDetails = data.orderdetails;
                        this.transactionData = data.transactions[0];
                        if (this.transactionData['paymentType'] == 'googlepay' || this.transactionData['paymentType'] == 'applepay') {
                            this.paymentData = this.transactionData['additionalData']['source'];
                        } else {
                            this.paymentData = this.transactionData['additionalData']['source']['card'];
                        }
                        this.discountAmount = parseFloat(data.discountApplied.discountAmount);
                        delete this.orderData['account'];
                        delete this.orderData['establishment'];
                        delete this.orderData['orderdetails'];
                        this.establishmentLatitude = this.establishmentData['geoLocation'].coordinates[1];
                        this.establishmentLongitude = this.establishmentData['geoLocation'].coordinates[0];
                        this.isReceiptDataLoaded = true;
                        this.userService.hideAppSpinner();
                    });
            });
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
                .receiptpage .box{max-width: 997px;margin: 0 auto;}
                .receiptbox{max-width: 540px;margin: 0 auto;}
                .receipttable h4{margin-bottom: 20px;}
                .receipttable .productname,
                .receipttable .totalprice,
                .receipttable td,
                .receipttable th,
                .receipttable tfoot td span.tabletotal,
                .receipttable .carttotal{font-size: 14px;}
                .receipttable .table thead th{padding: 5px;border-top: 0px;border-bottom: 1px solid rgba(151, 151, 151, 0.15);font-weight: normal;}
                .receipttable td{padding: 10px;border-top: 0px;vertical-align: middle;}
                .receipttable .productimg img{height: 60px;width: 100%;object-fit: contain;}
                .receipttable .productname{text-align: left;}
                .receipttable tbody{border-bottom: 1px solid rgba(151, 151, 151, 0.15);}
                .receipttable tfoot td{padding: 5px 10px;color: #8D8D8D}
                .receipttable tfoot tr:first-child td{padding: 20px 10px 5px;}
                .receipttable tfoot tr:nth-child(5n) td{padding: 5px 10px 10px;}
                .receipttable tfoot tr:nth-child(5n) td:nth-child(3n),
                .receipttable tfoot tr:nth-child(5n) td:nth-child(4n){border-bottom: 1px solid rgba(151, 151, 151, 0.15);}
                .receipttable tfoot tr:last-child td{padding: 10px 10px 5px;}
                .receiptbox h5{margin-top: 20px;margin-bottom: 25px;}
                .receiptoverview{display: -webkit-box; display: -ms-flexbox; display: flex;    -webkit-box-align: start; -ms-flex-align: start; align-items: flex-start;    -webkit-box-pack: justify; -ms-flex-pack: justify; justify-content: space-between;font-size: 14px;}
                .receiptoverview span{color: #8D8D8D;}
                .receiptoverview p{color: #000;}
                .receiptoverview a{color: #468EE5;}
                .receiptbtmline p{font-size: 14px;text-align: right;}
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

    goBackButton() {
        if (this.userService.getMyOrderState() != null) {
            if (this.userService.getMyOrderState() == "CheckoutSummary") {
                this.router.navigate(['/checkout-summary', this.orderId]);
            } else {
                this.router.navigate(['/myorders']);
            }
        }
    }
}
