import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { ProviderServiceService } from "../../../app/shared/services/provider-service.service";
import { UserService } from '../../shared/services/user.service';
import * as moment from 'moment';
import { DynamicScriptLoaderService } from '../../shared/services/DynamicScriptLoader';
declare var jQuery: any;


declare var $: any;
@Component({
    selector: 'app-cart-delivery',
    templateUrl: './cart-delivery.component.html',
    styleUrls: ['./cart-delivery.component.css']
})
export class CartDeliveryComponent implements OnInit {

    public userDeliveryLocation: any = {};
    public currentUserData: Object = this.userService.getCurrentUserData();
    public establishmentLatitude: number = 0;
    public establishmentLongitude: number = 0;
    public zoom: number = 16;
    public datepickerCheckInterval: any;
    public scriptLoaded = false;
    isToday: boolean = true;
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    constructor(
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private router: Router,
        private dynamicScriptLoader: DynamicScriptLoaderService
    ) { }

    ngOnInit() {
        this.loadScripts();
        this.ProviderServiceService.getuserDeliveryLocation()
            .subscribe(data => {
                this.userDeliveryLocation = data[0];
                this.establishmentLatitude = this.userDeliveryLocation.geoLocation.coordinates[1];
                this.establishmentLongitude = this.userDeliveryLocation.geoLocation.coordinates[0];
                this.userService.setuserDeliveryLocation(data);
                this.userService.hideAppSpinner();
            });
            console.log(typeof jQuery('#datepicker').datepicker);
           
        
    }
    private loadScripts() {
        // You can load multiple scripts by just providing the key as argument into load method of the service
        this.dynamicScriptLoader.load('jqueryUI').then(data => {
          console.log('Script Loaded Successfully');
          this.scriptLoaded = true;
        }).catch(error => console.log(error));
      }
    ngAfterViewInit(){
        this.datepickerCheckInterval = setInterval(() => {
            console.log(typeof jQuery('#datepicker').datepicker);
            if (typeof jQuery('#datepicker').datepicker != "undefined") {
                clearInterval(this.datepickerCheckInterval);
                let self = this;
                jQuery('#datepicker').datepicker({
                    firstDay: 1, minDate: 0,
                    dateFormat: 'mm-dd-yy',
                    onSelect: function (dateText, inst) {
                        $("#dateForServer").text(moment(dateText, 'MM-DD-YYYY').format('MMMM D, YYYY'));
                        self.userService.setDateDelivery(dateText);
                    }
                });
                var todayDate = jQuery('#datepicker').datepicker("getDate");
                $("#dateForServer").text(self.months[todayDate.getMonth()] + " " + todayDate.getDate() + ", " + todayDate.getFullYear());
                if (this.userService.isDateset()) {
        
                    todayDate = this.userService.getDateSet();
                    console.log(todayDate);
                    jQuery('#datepicker').datepicker({
                        dateFormat: 'mm-dd-yy',
                    }).datepicker('setDate', todayDate);
                    $("#dateForServer").text(moment(todayDate, 'MM-DD-YYYY').format('MMMM D, YYYY'));
                }
            }
        }, 10);

    }
    setTodayDate() {
        let self = this;
        jQuery('#datepicker').datepicker({
            dateFormat: 'mm-dd-yy',
        }).datepicker('setDate', 'today');
        var todayDate = jQuery('#datepicker').datepicker("getDate");
        console.log(todayDate);
        self.userService.setDateDelivery(moment(todayDate).format('MM-DD-YYYY'));
        $("#dateForServer").text(self.months[todayDate.getMonth()] + " " + todayDate.getDate() + ", " + todayDate.getFullYear());
        //(<any>$('#datepicker')).change();

    }
    formatDate1(dateText) {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateselected = dateText.split("-");
        let monthSelected = (months.indexOf(dateselected[0]) + 1) < 10 ? "0" + (months.indexOf(dateselected[0]) + 1) : (months.indexOf(dateselected[0]) + 1);
        return monthSelected + " " + dateselected[1] + ", " + dateselected[2];
    }

    cart_step1_next() {
        // if ($("#dateForServer").val() == "") {
        //     window.scrollTo(0, 0);
        //     this.userService.showflashMessage("danger", "Please select Delivery Datetime before moving forward");
        // } else {
        //     let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        //     let dateselected = $("#datetimepicker").val().split(" ");
        //     console.log(dateselected);
        //     let monthSelected = (months.indexOf(dateselected[0]) + 1) < 10 ? "0" + (months.indexOf(dateselected[0]) + 1) : (months.indexOf(dateselected[0]) + 1);
        //     console.log(monthSelected);
        //     let datenew = monthSelected + '-' + dateselected[1].replace(/,\s*$/, "") + '-' + dateselected[2];
        //     console.log(datenew);
        //     this.ProviderServiceService.getDeliveryDates(datenew)
        //         .subscribe(data => {
        //             console.log("data", data);
        //             if (data.error) {
        //                 this.userService.showflashMessage("danger", data.error.message);
        //             } else {
        //console.log(data.deliveryDate);
        //                 $('#dateForServer').text(data.deliveryDate);
        //                 // this.userService.setUserDeliveryDateTime(data.deliveryDate);
        //                 this.userService.setUserDeliveryDateTime(data);
        //                 this.router.navigate(['/cart-placeorder']);
        //             }
        //         });
        // }
        if ($("#dateForServer").text() == "") {
            window.scrollTo(0, 0);
            this.userService.showflashMessage("danger", "Please select Delivery Datetime before moving forward");
        } else {
            let datenew = $("#datepicker").val();
        }
    }

}
