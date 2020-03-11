import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GOOGLE_API_KEY, API_URL, BUCKET_NAME } from './../../constants/constants';
import request from 'request';
import { UserService } from './../../shared/services/user.service';
import { ProviderServiceService } from './../../shared/services/provider-service.service';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { } from '@types/googlemaps';
import * as $ from "jquery";
import { forEach } from '@angular/router/src/utils/collection';
@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
    public searchControl: FormControl;
    public latitude: number;
    public longitude: number;
    public formatted_address: string;
    public mainImage: Object = {};
    public partnerImages: Array<any> = [];
    public isError: boolean = false;
    private userDeliveryAddressToUse: {};
    public enteredAddress: string = '';
    @ViewChild("search")
    public searchElementRef: ElementRef;
    public dynamicMiles: number = 0;
    public transport: number = (this.userService.getUserTransportmode()) ? this.userService.getUserTransportmode() : 0;
    constructor(
        private ProviderServiceService: ProviderServiceService,
        private userService: UserService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private router: Router,
   ) { }
    ngOnInit() {        
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
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
            this.enteredAddress = '';
        } else {
            this.enteredAddress = this.userDeliveryAddressToUse['address'];
            this.latitude = this.userDeliveryAddressToUse['geoLocation'].coordinates[1];
            this.longitude = this.userDeliveryAddressToUse['geoLocation'].coordinates[0];
            this.formatted_address = this.userDeliveryAddressToUse['address'];
            this.userService.setIsLocation(true);
        }
    }
    addressChanging() {
        this.latitude = null;
        this.longitude = null;
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
    onSave() {
        this.userService.showAppSpinner();
        if (this.latitude == null || this.longitude == null) {
            this.isError = true;
            this.userService.hideAppSpinner();
            setTimeout(() => this.isError = false, 15000)
        } else {
            this.isError = false;
            let userPickupAddress = [{
                "geoLocation": {
                    "coordinates": [
                        this.longitude,
                        this.latitude
                    ],
                    "type": "Point"
                },
                "address": this.formatted_address
            }];
            if (this.userService.isLoggedIn()) {
                this.ProviderServiceService.addLocation(this.latitude, this.longitude)
                    .subscribe(data => {
                        this.ProviderServiceService.addUserDeliveryLocation(this.latitude, this.longitude, this.formatted_address, data['id'])
                            .subscribe(data => {
                                this.ProviderServiceService.getuserDeliveryLocation()
                                    .subscribe(data => {
                                        this.userService.setuserDeliveryLocation(data);
                                        this.userService.setuserDeliveryLocationToUse(data[0]);                                      
                                        this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
                                            .subscribe(data => {
                                                this.userService.setCurrentUserData(data);
                                            })
                                        // })
                                        this.userService.hideAppSpinner();
                                        this.router.navigate(['/productlisting']);
                                    });
                            },
                                error => {
                                    this.userService.showflashMessage("danger", "Address already exists in your account. Please select the same and continue.");
                                    this.userService.hideAppSpinner();
                                });
                    },
                        error => {
                            this.userService.showflashMessage("danger", "Address already exists in your account. Please select the same and continue.");
                            this.userService.hideAppSpinner();
                        });
            } else {
                this.userService.setuserDeliveryLocation(userPickupAddress);
                this.userService.setuserDeliveryLocationToUse(userPickupAddress[0]);
                this.userService.setUserTransportmode(0);
                this.userService.hideAppSpinner();
                this.router.navigate(['/productlisting']);
            }
        }
    }
    saveUserPickupLocation() {
        this.userService.showAppSpinner();
        let address = $('form.primary-pickup [name="address"]').val();
        let latitude = $('form.primary-pickup [name="latitude"]').val();
        let longitude = $('form.primary-pickup [name="longitude"]').val();
        let transportMode = $('input[name="toggle"]:checked').val();
        let fullAddress = address;

        this.ProviderServiceService.updateUserProfile(this.dynamicMiles, parseInt(transportMode))
            .subscribe(data => {
                this.ProviderServiceService.getAccountData(this.userService.getCurrentAccountId())
                    .subscribe(data => {
                        this.userService.setCurrentUserData(data);
                    })
            })

        if (address == "") {
            window.scrollTo(0, 0);
            this.userService.showflashMessage("danger", "Please enter full address for better accuracy");
            this.userService.hideAppSpinner();
            return false;
        } else if (this.dynamicMiles == 0) {
            this.userService.showflashMessage("danger", "Please specify Radius to see best deals near you");
            this.userService.hideAppSpinner();
        } else if (latitude == "" || longitude == "") {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + fullAddress.replace(" /i", "+") + "&key=" + GOOGLE_API_KEY;
            request(url, (error, response, body) => {
                if (JSON.parse(body).status == "OK") {
                    latitude = JSON.parse(body).results[0].geometry.location.lat;
                    longitude = JSON.parse(body).results[0].geometry.location.lng;
                    this.ProviderServiceService.addLocation(parseFloat(latitude), parseFloat(longitude))
                        .subscribe(data => {
                            this.ProviderServiceService.addUserDeliveryLocation(parseFloat(latitude), parseFloat(longitude), fullAddress, data['id'])
                                .subscribe(data => {
                                    this.userService.showflashMessage("success", "Pickup location saved successfully");
                                    this.userService.hideAppSpinner();
                                },
                                    error => {
                                        this.userService.showflashMessage("danger", "Address already exists in your account. Please select the same and continue.");
                                        this.userService.hideAppSpinner();
                                    });
                        });
                } else {
                    this.userService.showflashMessage("danger", "Seems like you have entered an incorrect address. Please check and try again.");
                    this.userService.hideAppSpinner();
                }
            });
        } else {
            this.ProviderServiceService.addLocation(parseFloat(latitude), parseFloat(longitude))
                .subscribe(data => {
                    this.ProviderServiceService.addUserDeliveryLocation(parseFloat(latitude), parseFloat(longitude), fullAddress, data['id'])
                        .subscribe(data => {
                            this.userService.showflashMessage("success", "Pickup location saved successfully");
                            this.userService.hideAppSpinner();
                        },
                            error => {
                                this.userService.showflashMessage("danger", "Address already exists in your account. Please select the same and continue.");
                                this.userService.hideAppSpinner();
                            });
                });
        }
    }
    myOnChange(args: any) {
        this.dynamicMiles = args.from;
    }
}