import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { GOOGLE_API_KEY } from './../../constants/constants';
import request from 'request';
import { UserService } from './../../shared/services/user.service';
import { ProviderServiceService } from './../../shared/services/provider-service.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { } from '@types/googlemaps';
import * as $ from "jquery";
import { Router } from '@angular/router';

@Component({
    selector: 'app-primarydelivery',
    templateUrl: './primarydelivery.component.html',
    styleUrls: ['./primarydelivery.component.css']
})
export class PrimarydeliveryComponent implements OnInit {
    public searchControl: FormControl;
    public latitude: number;
    public longitude: number;
    public formatted_address: string;
    public userDeliveryLocation: Array<any> = [];
    public goBackToProductListing: boolean = false;

    @ViewChild("search")
    public searchElementRef: ElementRef;

    public dynamicMiles: number = 0;
    public radius: number = (this.userService.getUserRadiusMiles()) ? this.userService.getUserRadiusMiles() : 0;
    public transport: number = (this.userService.getUserTransportmode()) ? this.userService.getUserTransportmode() : 0;
    constructor(
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        public router: Router
    ) { }

    ngOnInit() {
        this.dynamicMiles = this.radius;
        this.userDeliveryLocation = this.userService.getuserDeliveryLocation();
        if (this.userDeliveryLocation.length == 0) {
            this.goBackToProductListing = true;
        }
        this.searchControl = new FormControl();
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["address"]
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.formatted_address = place.formatted_address

                    let userPickupAddress = [{
                        "geoLocation": {
                            "coordinates": [
                                place.geometry.location.lng(),
                                place.geometry.location.lat()
                            ],
                            "type": "Point"
                        },
                        "address": this.formatted_address
                    }];
                });
            });
        });
    }

    getCurrentAddress() {
        this.userService.showAppSpinner();
        if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    this.ProviderServiceService.getCurrentAddress(position.coords.latitude, position.coords.longitude, (status, response) => {
                        if (status) {
                            $('form.primary-pickup [name="address"]').val(response.formatted_address);
                            $('form.primary-pickup [name="latitude"]').val(response.latitude);
                            $('form.primary-pickup [name="longitude"]').val(response.longitude);
                        } else {
                        }
                        this.userService.hideAppSpinner();
                    });
                },
                error => {
                    this.ProviderServiceService.getCurrentAddress(40.682570, -73.930284, (status, response) => {
                        if (status) {
                            $('form.primary-pickup [name="address"]').val(response.formatted_address);
                            $('form.primary-pickup [name="latitude"]').val(response.latitude);
                            $('form.primary-pickup [name="longitude"]').val(response.longitude);
                        }
                        this.userService.hideAppSpinner();
                    });
                }
            );
        }
    }

    saveuserDeliveryLocation() {
        this.userService.showAppSpinner();

        let address = $('form.primary-pickup [name="address"]').val();
        let latitude = $('form.primary-pickup [name="latitude"]').val();
        let longitude = $('form.primary-pickup [name="longitude"]').val();
        let fullAddress = address;        
        if (address == "") {
            window.scrollTo(0, 0);
            this.userService.showflashMessage("danger", "Enter the delivery address to continue");
            this.userService.hideAppSpinner();
            return false;
        } 
    }

    myOnChange(args: any) {
        this.dynamicMiles = args.from;
    }
    toggleImage() {
        let toggleValue = $("[name='toggle']:checked").val();
        if (toggleValue == 1) {
            $("#tog-img1").attr("src", "assets/images/radio1-2.png");
            $("#tog-img2").attr("src", "assets/images/radio2-1.png");
        } else if (toggleValue == 0) {
            $("#tog-img1").attr("src", "assets/images/radio1-1.png");
            $("#tog-img2").attr("src", "assets/images/radio2-2.png");
        }
    }
}