import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import { MapsAPILoader } from '@agm/core';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
    selector: 'app-bartenders',
    templateUrl: './bartenders.component.html',
    styleUrls: ['./bartenders.component.css']
})
export class BartendersComponent implements OnInit {
    public barTenderForm: FormGroup;
    public formSubmitAttempt = false;
    public serviceMatStatus = true;
    public isToday = new Date();
    public Today: any;
    public searchControl: FormControl;
    public latitude: number;
    public longitude: number;
    public formatted_address: string;
    public mainImage: Object = {};
    public partnerImages: Array<any> = [];
    public isError: boolean = false;
    public enteredAddress: string = '';
    public currentUser: any;
    public location: any;
    public modalStatus: boolean = false;
    public userDeliveryAddressToUse: Object = {};
    public isLocationEntered: boolean = false;
    public phoneNumberModel: string = '';
    public firstNameModel: string = '';
    public lastNameModel: string = '';
    public emailModel: string = '';
    @ViewChild('search')
    public searchElementRef: ElementRef;
    public dynamicMiles: number = 0;
    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private ProviderServiceService: ProviderServiceService,
        private fb: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private router: Router,
        private _flashMessagesService: FlashMessagesService,

    ) { }
    ngOnInit() {
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse())
            ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation()
                && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.isLocationEntered = false;
            this.userService.setIsLocation(false);
        } else {
            this.isLocationEntered = true;
            this.userService.setIsLocation(true);
        }
        this.Today = moment(this.isToday).format('MMMM D, YYYY');
        this.barTenderForm = this.fb.group({
            address: ['', Validators.required],
            numOfGuests: ['', Validators.required],
            numOfBartenders: ['', Validators.required],
            requireSvcMaterials: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNum: ['', Validators.required],
            emailId: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
        });
        this.userService.barTenderFormJs();
        this.userService.setBartenderForm();
        // location search 
        this.searchControl = new FormControl();
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.formatted_address = place.formatted_address

                    let userPickupAddress = [{
                        'geoLocation': {
                            'coordinates': [
                                place.geometry.location.lng(),
                                place.geometry.location.lat()
                            ],
                            'type': 'Point'
                        },
                        'address': this.formatted_address
                    }];
                });
            });
        });
        if (this.userService.isLoggedIn()) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.firstNameModel = this.currentUser.firstName;
            this.lastNameModel = this.currentUser.lastName;
            this.phoneNumberModel = this.currentUser.phoneNumber;
            this.emailModel = this.currentUser.email;
        }
    }
    onSubmit() {
        let eventDate = $('#datevalue').val();
        let eventStartTime = $('[name="eventStartTime"]').val();
        let eventEndTime = $('[name="eventEndTime"]').val();
        let isFormValid = true;
        let isDateValid = true;
        let newDate;
        let newStartTime;
        let newEndTime;
        if (!this.barTenderForm.valid) {
            this.formSubmitAttempt = true;
            isFormValid = false;
        }
        if (eventDate == '' || eventStartTime == '' || eventEndTime == '') {
            eventDate == '' ? $('.eventDateError').text('Please choose Event Start Date').show() : $('.eventDateError').hide();
            eventStartTime == '' ? $('.eventStartTimeError').show() : $('.eventStartTimeError').hide();
            eventEndTime == '' ? $('.eventEndTimeError').show() : $('.eventEndTimeError').hide();
            this.formSubmitAttempt = true;
            isDateValid = false;
        } else {
            newDate = moment(eventDate).format('YYYY-MM-DD');
            newStartTime = moment(newDate + ' ' + eventStartTime);
            newEndTime = moment(newDate + ' ' + eventEndTime);
            // let timeDifferent  = newStartTime - currentTime;
            let toBeStartTime = moment(newStartTime).format('YYYY-MM-DD HH:mm:ss');
            let currentTime = moment(this.isToday).format('YYYY-MM-DD HH:mm:ss');
            let diffTime = (moment(toBeStartTime).subtract(48, 'hours').format('YYYY-MM-DD HH:mm:ss'));
            if (currentTime <= diffTime) {
                var newEventStartTime = toBeStartTime;
                $('.hideAllError').hide();
                isDateValid = true;
            } else {
                $('.eventDateError').text('Start date should be atleast 48hours ahead').show();
                this.formSubmitAttempt = true;
                var newEventStartTime = ' ';
                $('.eventStartTimeError').hide();
                $('.eventEndTimeError').hide();
                isDateValid = false;
            }
        }
        if (!isFormValid || !isDateValid) {
            return;
        }
        this.formSubmitAttempt = false;

        const materialStatus = this.barTenderForm.get('requireSvcMaterials').value;
        if (materialStatus === 'No') {
            this.serviceMatStatus = false;
        }
        // concat date and time
        const bookingBartenderDetail = {
            address: $('[name="address"]').val(),
            eventStartTime: moment(newEventStartTime).format('YYYY-MM-DD HH:mm:ss'),
            eventEndTime: moment(newEndTime).format('YYYY-MM-DD HH:mm:ss'),
            numOfGuests: this.barTenderForm.get('numOfGuests').value,
            numOfBartenders: this.barTenderForm.get('numOfBartenders').value,
            requireSvcMaterials: this.serviceMatStatus,
            firstName: $('[name="firstName"]').val(),
            lastName: $('[name="lastName"]').val(),
            phoneNum: $('[name="phoneNum"]').val(),
            emailId: $('[name="emailId"]').val()
        };
        console.log(bookingBartenderDetail);
      this.ProviderServiceService.getBartenders(bookingBartenderDetail).subscribe(res => {
             if (res.status == 200) {
                 document.getElementById('request').click();
            //   setTimeout(() => {
            //     this.router.navigate(['/']);
            //    }, 1000);
            }
        });
    }
    moveHome() {
         this.router.navigate(['/']);
   }
    // for vailidation
    get address() { return this.barTenderForm.get('address'); }
    get eventDate() { return this.barTenderForm.get('eventDate'); }
    get eventStartTime() { return this.barTenderForm.get('eventStartTime'); }
    get eventEndTime() { return this.barTenderForm.get('eventEndTime'); }
    get numOfGuests() { return this.barTenderForm.get('numOfGuests'); }
    get numOfBartenders() { return this.barTenderForm.get('numOfBartenders'); }
    get requireSvcMaterials() { return this.barTenderForm.get('requireSvcMaterials'); }
    get firstName() { return this.barTenderForm.get('firstName'); }
    get lastName() { return this.barTenderForm.get('lastName'); }
    get phoneNum() { return this.barTenderForm.get('phoneNum'); }
    get emailId() { return this.barTenderForm.get('emailId'); }
}
