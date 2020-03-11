import { CallbackPipe } from './../../shared/pipes/callback.pipe';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderServiceService } from './../../shared/services/provider-service.service';
import { UserService } from './../../shared/services/user.service';

@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.css'],
    providers: [CallbackPipe]
})
export class MyordersComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public loggedInUserData: Array<any> = [];
    public userPickupAddress: Array<any> = [];
    public userOrders: Array<any> = [];
    public isOrderDateLoaded: boolean = false;
    public isSelectedPane: String = 'pane-A';
    public userDeliveryAddressToUse = {};
    public isLocationEntered: boolean = false;
    public sortReverse: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
        this.userService.showAppSpinner();
        this.ProviderServiceService.getUserOrders()
            .subscribe(data => {
                this.userOrders = data;
                this.userService.setUserOrders(data);
                this.userService.hideAppSpinner();
                this.isOrderDateLoaded = true;
                if (this.userService.getMyOrderState() != null) {
                    setTimeout(() => {
                        $("a[data-toggle='tab']:contains('" + this.userService.getMyOrderState() + "')").trigger("click");
                        this.userService.unsetMyOrderState();
                    }, 100);
                }
            });
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.isLocationEntered = false;
            this.userService.setIsLocation(false);
        } else {
            this.isLocationEntered = true;
            this.userService.setIsLocation(true);
        }
    }

    ngAfterContentChecked() {
        this.loggedInUserData = (this.isUserLoggedIn) ? this.userService.getCurrentUserData() : []
        this.isUserLoggedIn = this.userService.isLoggedIn();
    }

    public filterpending_pickup(order: any) {
        return order.status == 1;
    }

    public filterpending_acceptance(order: any) {
        return order.status == 0;
    }

    public filterpast_orders(order: any) {
        return order.status == 2;
    }

    public filtercancelled_orders(order: any) {
        return order.status == 4;
    }

    public filterrejected_orders(order: any) {
        return order.status == 3;
    }

    public filterrejectedId_orders(order: any) {
        return order.status == 5;
    }

    changeTitleText(args: any) {
        let currentText = $(args.currentTarget).text();
        $('#changeTitleText').html(currentText);
    }

    viewReceipt(orderId: string, myOrderState: string) {
        this.userService.setMyOrderState(myOrderState);
        this.router.navigate(['/view-receipt', orderId]);
    }

    reviewProduct(orderId: string, myOrderState: string) {
        this.userService.setMyOrderState(myOrderState);
        this.router.navigate(['/review-product', orderId]);
    }
    activeClass(args) {
        this.isSelectedPane = args;
    }
    onRatingClick(args, productId) {
        this.ProviderServiceService.submitProductRating(args.rating, productId).subscribe();
    }
    sortOrders(val) {
        switch (val) {
            case "Most Recent":
                this.sortReverse = true;
                break;
            case "Old":
                this.sortReverse = false;
                break;
        }
    }
}
