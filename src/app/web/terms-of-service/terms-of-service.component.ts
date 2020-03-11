import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'app-terms-of-service',
    templateUrl: './terms-of-service.component.html',
    styleUrls: ['./terms-of-service.component.css']
})
export class TermsOfServiceComponent implements OnInit {
    userDeliveryAddressToUse = {}
    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ) { }

    ngOnInit() {
        $('header, footer').addClass('hidden');
        $('.profile-head').css("margin-top", "0px");
        // }
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
        } else {
            this.userService.setIsLocation(true);
        }
    }

}
