import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
    userDeliveryAddressToUse = {}

    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ) { }
    ngOnInit() {
        $('header, footer').addClass('hidden');
        $('.profile-head').css("margin-top", "0px");
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
        } else {
            this.userService.setIsLocation(true);
        }
    }
}
