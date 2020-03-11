import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { UserService } from '../../shared/services/user.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
    userDeliveryAddressToUse = {}
    element: any;
    hash: string = "";
    constructor(private userService: UserService) { }

    ngOnInit() {
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
        } else {
            this.userService.setIsLocation(true);
        }
    }
    scrollToElement(id) {
        this.element = document.querySelector("#" + id);
        if (this.element) {
            this.hash = "#" + id;
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;

                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 100
                }, 800);
            }
        }
    }

}
