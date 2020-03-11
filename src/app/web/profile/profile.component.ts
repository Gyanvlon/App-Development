import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProviderServiceService } from "../../../app/shared/services/provider-service.service";
import { UserService } from '../../shared/services/user.service';
import * as $ from "jquery";
import { CallbackPipe } from '../../shared/pipes/callback.pipe';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [CallbackPipe]
})
export class ProfileComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public loggedInUserData: Array<any> = [];
    public userPickupAddress: Array<any> = [];
    public userOrders: Array<any> = [];
    public userOrdersToShow: Array<any> = [];
    public userSavedCards: Array<any> = [];
    public userPoints: any;

    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit() {
        this.userService.showAppSpinner();
        Observable.forkJoin(
            this.ProviderServiceService.getuserDeliveryLocation(),
            this.ProviderServiceService.getUserOrders(),
            this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
        ).subscribe(data => {
            this.userPickupAddress = data[0];
            this.userService.setuserDeliveryLocation(data[0]);

            this.userOrders = data[1];
            this.userOrdersToShow = data[1].slice(0, 3);
            this.userService.setUserOrders(data[1]);
            this.userService.setCurrentUserData(data[2]);

            this.userService.hideAppSpinner();
        }, error => {
            if (error.message == "Authorization Required" || error.message == "Invalid Access Token" || error.statusText == "Unauthorized") {
                this.userService.setLoginPopupCheck('true');
            }
            this.userService.hideAppSpinner();
        });

        this.ProviderServiceService.getUserSavedCards(data => {
            this.userSavedCards = data.sources.data;
        });
    }

    ngAfterContentChecked() {
        this.loggedInUserData = (this.isUserLoggedIn) ? this.userService.getCurrentUserData() : []
        this.isUserLoggedIn = this.userService.isLoggedIn();
    }

    public filterOrders(order: any) {
        return order.status == 0 || order.status == 1;
    }

    public setdefaultCard(args: any) {
        this.ProviderServiceService.setUserDefaultCard($(args.currentTarget).data('card-id'), data => {
        });
    }

    public deleteCard(args: any) {
        this.ProviderServiceService.deleteUserSavedCards($(args.currentTarget).data('card-id'), data => {
            this.ProviderServiceService.getUserSavedCards(data => {
                this.userSavedCards = data.sources.data;
            });
        });
    }
}
