import { Moment } from 'moment-timezone';
import { Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ProviderServiceService } from '../../../app/shared/services/provider-service.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { MapsAPILoader } from '@agm/core';
import * as $ from 'jquery';
import * as moment from 'moment';
import { _iterableDiffersFactory } from '@angular/core/src/application_module';
declare var jQuery: any;
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
    selector: 'app-productlisting',
    templateUrl: './productlisting.component.html',
    styleUrls: ['./productlisting.component.css']
})
export class ProductlistingComponent implements OnInit {
    public isUserLoggedIn: boolean = this.userService.isLoggedIn();
    public productListing: Array<any> = [];
    public filterListing: Array<any> = [];
    public allProductListing: Array<any> = [];
    public tempProductListing: Array<any> = [];
    public productFilterArray: Array<any> = [];
    public currentUserDetails: any = (this.userService.isLoggedIn()) ? this.userService.getCurrentUserData() : {};
    public userDeliveryAddress: Array<any> = (this.userService.getuserDeliveryLocation()) ? this.userService.getuserDeliveryLocation() : [];
    public userDeliveryAddressToUse: Object = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
    public userDeliveryAddressToUseAddressId = '';
    public userTravelMode: string = (this.userService.getUserTransportmode() === 0) ? 'walk' : 'drive';
    public selectedEstablishmentId = '';
    public breadcumbEstablishmentId = '';
    public breadcumbProductCategory = 'ALL';
    public productCount: any = -1;
    public productCountDisplay: any = 0;
    public searchIntervalID: any = 0;
    public isError = false;
    public latitude: number;
    public longitude: number;
    public formatted_address: string;
    public searchControl: FormControl;
    public deliveryAddress = '';
    public classObject = [];
    public sortingKey = 'product.iName';
    public sortingReverse = false;
    public sortingTypeSelected = 'Name: A-Z';
    public offerloaded = false;
    public scrollPosition = 0;
    public storeState = {};
    public allDataListWithFilters = {};
    public selectedFilter = 'category';
    public searchCount = 1;
    public record_Open_Azcordian = [];
    public sortingApplied = false;
    public showProductListing = true;
    public barTenderForm: FormGroup;
    public formSubmitAttempt = false;
    public serviceMatStatus = true;
    public testTime: any = 5;
    public currentUser: any;
    public isToday = new Date();
    public Today: any;
    public EventDate: any;
    public enteredAddress: string = '';
    @ViewChild('delivery')
    public searchElementRef: ElementRef;
    @ViewChild('search')
    public searchLocationElementRef: ElementRef;
    public dynamicMiles: number = 0;
    public phoneNumberModel: string = '';
    public firstNameModel: string = '';
    public lastNameModel: string = '';
    public emailModel: string = '';
    constructor(
        private userService: UserService,
        private router: Router,
        private fb: FormBuilder,
        private ProviderServiceService: ProviderServiceService,
        private route: ActivatedRoute,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private flashMessagesService: FlashMessagesService
    ) { }
    ngOnInit() {
        this.userService.mobilejs();
        



        this.showProductListing = true;
        this.Today = moment(this.isToday).format('MMMM D, YYYY');
        this.barTenderForm = this.fb.group({
            address: ['', Validators.required],
            numOfGuests: ['', Validators.required],
            numOfBartenders: ['', Validators.required],
            requireSvcMaterials: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phoneNum: ['', Validators.required],
            email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
        });
        this.route.params.subscribe(params => {
            if (params.establishmentId) {
                this.breadcumbEstablishmentId = params.establishmentId;
            }
            if (params.productCategory) {
                this.breadcumbProductCategory = params.productCategory;
            }
        });
        this.searchControl = new FormControl();
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    const place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    this.isError = false;                  
                    if (place.geometry === undefined || place.geometry === null) {
                        this.isError = true;
                        return;
                    }
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.formatted_address = place.formatted_address;

                    const userPickupAddress = [{
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
        this.userService.showAppSpinner();
        this.userDeliveryAddressToUse = (this.userService.getuserDeliveryLocationToUse()) ? this.userService.getuserDeliveryLocationToUse() : ((this.userService.getuserDeliveryLocation() && this.userService.getuserDeliveryLocation().length > 0) ? this.userService.getuserDeliveryLocation()[0] : {});
        if (Object.keys(this.userDeliveryAddressToUse).length === 0) {
            this.userService.setIsLocation(false);
        } else {
            this.userService.setIsLocation(true);
        }

        this.userService.setAnimationToCategoryFilter($('#accord1'));

        this.ngZone.run(() => { // <== added
            this.storeState = this.userService.getStoreState();
            if (Object.keys(this.storeState).length !== 0 && this.userService.getPreviousUrl().indexOf('productdetail') > -1) {
                this.setAllValues(this.storeState);
            } else {
                this.userService.isSerachTerm.subscribe(searchText => {
                    this.showProductListing = true;
                    this.getAllProducts(searchText);
                });
            }

        });
        this.userService.setCustomJsToFormData(); // to set custom js to form data
         setTimeout(() => {
             this.userService.scrollDownFilter();
        }, 500);
    }
    showImages(i) {
        this.productListing[i].loaded = true;
    }
    getAllProducts(searchText: any) {
        this.classObject = [];
        $('.all').prop('checked', true);
        if (Object.keys(this.userDeliveryAddressToUse).length > 0) {
            this.ProviderServiceService.getCurrentOffers(this.userDeliveryAddressToUse, searchText)
                .subscribe(data => {
                    data.offers.forEach(element => {
                        element.loaded = false;
                    });
                    this.allDataListWithFilters = data;
                    this.userService.offerLoaded = true;
                    this.allProductListing = this.productListing = this.tempProductListing = data.offers;
                    this.filterListing = data.filters;
                    this.productCount = this.productCountDisplay = this.productListing.length;
                    this.sortItems(this.sortingKey, this.sortingReverse);
                });
        } else {
            this.router.navigate(['/']);
        }
    }
    applyClassFilter(j) {
        for (let f = 0; f < this.classObject.length; f++) {
            if (this.classObject[f]['catIndex'] === j) {
                return true;
            }
        }
        return false;
    }
    applyClassSubFilter(j, i) {
        for (let f = 0; f < this.classObject.length; f++) {
            if (this.classObject[f]['catIndex'] === j) {
                if (this.classObject[f]['valueIndex'] === i) {
                    return true;
                }
            }
        }
        return false;
    }
    recordOpenaAcordian(j, ev) {
        if (ev.target.nodeName === 'SPAN' || ev.target.nodeName === 'IMG') {
            if (this.record_Open_Azcordian.includes(j)) {
                this.record_Open_Azcordian.splice(this.record_Open_Azcordian.indexOf(j), 1);
            } else {
                this.record_Open_Azcordian.push(j);
            }
        }

    }

    fliterProductCategoary(categoryType, value, catIndex, valueIndex) {      
        if (categoryType === 'price') {
            value = value.trim();
            if (value.indexOf('<') !== -1) {
                value = value.split('<');
                value[0] = 0;
                value[1] = +(value[1].substring(1, value[1].length - 1));
            } else if (value.indexOf('+') !== -1) {
                value = value.split('$');
                value[0] = +(value[0].substring(0, value[0].length));
                value[1] = 100000;
            } else {
                value = value.split('-');
                value[0] = +(value[0].substring(0, value[0].length - 2));
                value[1] = +(value[1].substring(1, value[1].length - 1));
            }
        }
        const tempObj = {
            'catIndex': catIndex,
            'valueIndex': valueIndex,
            'cat': categoryType,
            'value': value
        };
        let isFound = false;
        this.productListing = this.tempProductListing;
        if (this.classObject.length === 0) {
            this.classObject.push(tempObj);
        } else {
            for (let f = 0; f < this.classObject.length; f++) {
                if (this.classObject[f]['catIndex'] === catIndex) {
                    if (this.classObject[f]['valueIndex'] === valueIndex) {
                        this.classObject.splice(f, 1);
                        isFound = true;
                        break;
                    }
                    this.classObject[f] = tempObj;
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                this.classObject.push(tempObj);
            }
        }
        if (this.classObject.length < 1) {
            this.productListing = this.tempProductListing;
        } else {
            for (let g = 0; g < this.classObject.length; g++) {
                if (this.classObject[g].cat === 'price') {
                    this.productListing = this.productListing.filter(
                        productdetail => productdetail['salePrice'] >= this.classObject[g].value[0] && productdetail['salePrice'] <= this.classObject[g].value[1]);

                } else if (this.classObject[g].cat === 'size') {
                    this.productListing = this.productListing.filter(
                        productdetail => productdetail.product['size'].toString() + ' ' + productdetail.product['units'].toString() === this.classObject[g].value);
                } else {
                    const tempListing = this.productListing;
                    this.productListing = [];
                    for (let k = 0; k < tempListing.length; k++) {
                        if (tempListing[k].product[this.classObject[g].cat]) {
                            if (tempListing[k].product[this.classObject[g].cat].toString().includes(this.classObject[g].value.toString())) {
                                this.productListing.push(tempListing[k]);
                            }
                        }
                    }
                }
            }
        }
        this.productCount = this.productCountDisplay = this.productListing.length;
        this.userService.setFilterObj(this.classObject);
    }
    sortItems(key, type) {

        if (key === 'product.iName' && type === false) {
            for (let i = 0; i < this.productListing.length; i++) {
                if (this.productListing[i].isSponsored) {
                    this.productListing[i].product['iName'] = '0' + this.productListing[i].product['name'];
                } else {
                    this.productListing[i].product['iName'] = this.productListing[i].product['name'];
                }
            }
        }
        if (key === 'product.iName' && type === true) {
            for (let i = 0; i < this.productListing.length; i++) {
                if (this.productListing[i].isSponsored) {
                    this.productListing[i].product['iName'] = 'ZZ' + this.productListing[i].product['name'];

                }
            }
        }
        if (key === 'iSalePrice' && type === false) {
            for (let i = 0; i < this.productListing.length; i++) {
                if (this.productListing[i].isSponsored) {
                    this.productListing[i].iSalePrice = this.productListing[i].salePrice - 10000;
                } else {
                    this.productListing[i].iSalePrice = this.productListing[i].salePrice;
                }
            }
        }
        if (key === 'iSalePrice' && type === true) {
            for (let i = 0; i < this.productListing.length; i++) {
                if (this.productListing[i].isSponsored) {
                    this.productListing[i].iSalePrice = this.productListing[i].salePrice + 10000;
                } else {
                    this.productListing[i].iSalePrice = this.productListing[i].salePrice;
                }
            }
        }


    }

    sortProduct(key, type, ev) {
        this.sortItems(key, type);
        this.sortingKey = key;
        this.sortingReverse = type;
        this.sortingTypeSelected = ev.target.text;
        this.sortingApplied = true;
    }

    public categoryFilter(args) {
               if (args.target.value === 'Bartender') {
            if (this.userService.isLoggedIn()) {
                this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.firstNameModel = this.currentUser.firstName;
                this.lastNameModel = this.currentUser.lastName;
                this.phoneNumberModel = this.currentUser.phoneNumber;
                this.emailModel = this.currentUser.email;
            }
           this.showProductListing = false;
           $('.accordianData').hide();
            $(function () {
                jQuery('#timepicker').timepicker({
                    dynamic: false,
                    dropdown: true,
                    scrollbar: true,
                    change: function () {
                        $('#timepicker').addClass('filled');
                    }
                });
                jQuery('#timepicker1').timepicker({
                    dynamic: false,
                    dropdown: true,
                    scrollbar: true,
                    change: function () {
                        $('#timepicker1').addClass('filled');
                    }
                });
            });
            $(function () {
                jQuery('.calendar').datepicker({
                    firstDay: 1,
                    minDate: new Date(),
                    autoclose: true,
                    onSelect: function (dateText, inst) {
                        $('#datevalue').addClass('filled');
                        const date = $('#datevalue').val(moment(dateText, 'MM-DD-YYYY').format('MMMM D, YYYY'));
                        this.EventDate = $('#datevalue').val();
                        $('.formsection').trigger('click');
                    }
                }).on('change', function () {
                   $('.calendar').hide();
                });

                jQuery('.calendar').click(function(e) {
                    e.stopPropagation();
                });
            });

            setTimeout(() => {
                this.searchControl = new FormControl();
                this.mapsAPILoader.load().then(() => {
                    let autocomplete = new google.maps.places.Autocomplete(this.searchLocationElementRef.nativeElement, {
                        types: ['address']
                    });
                    autocomplete.addListener('place_changed', () => {
                        this.ngZone.run(() => {
                            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
                            this.isError = false;
                            if (place.geometry === undefined || place.geometry === null) {
                                this.isError = true;
                                return;
                            }
                            this.latitude = place.geometry.location.lat();
                            this.longitude = place.geometry.location.lng();
                            this.formatted_address = place.formatted_address;

                            const userPickupAddress = [{
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

            }, 1000);

            setTimeout(() => {
                this.userService.setCustomJsToFormData();
            }, 1000);
        } else {
           $('.accordianData').show();
           this.showProductListing = true;
        }
        this.classObject = [];
        this.breadcumbProductCategory = args.target.value;
        this.record_Open_Azcordian = [];

        this.filterListing = this.allDataListWithFilters[args.target.value.toLowerCase() + 'Filters'];
        if (args.target.value === 'Mixer') {
            this.filterListing = this.allDataListWithFilters['mixersFilters'];
        }
        if (args.target.value === 'All') {
            this.selectedFilter = 'allCategory';
            this.filterListing = this.allDataListWithFilters['filters'];
            this.productListing = this.allProductListing;
            this.tempProductListing = this.productListing;
            this.productCount = this.productCountDisplay = this.productListing.length;
            this.sortItems(this.sortingKey, this.sortingReverse);
            return;
        }
        if (args !== true) {
            this.selectedFilter = 'subCategory';
            this.productListing = this.allProductListing;
            this.productFilterArray = [];
            $('input[name=\'categoryFilter\']').each((index, item) => {
                if ($(item).is(':checked')) {
                    $(item).prop('checked', false);
                }
            });
            $(args.currentTarget).prop('checked', true);
            this.productFilterArray.push($(args.currentTarget).val());
        }
        if (this.productFilterArray.length > 0) {
            this.productListing = this.productListing.filter(
                product => {
                    return ($.inArray(product.product.category, this.productFilterArray) > -1) ? true : false;
                }
            );

            this.tempProductListing = this.productListing;
            this.productCount = this.productCountDisplay = this.productListing.length;
        }
        this.sortItems(this.sortingKey, this.sortingReverse);
    }
    // showProductListingOnMobile() {
    //     console.log('here is mobile js loaded');
    //     $('#stores ul li').click(function () {
    //         $('.mobileview-productlisting').css(
    //             {
    //                 'transform': 'translate(0%)',
    //                 'transition': 'all linear 0.2s'
    //             }
    //         );
    //     });
    //     $('.close-productListing-btn').click(function () {
    //         $('.mobileview-productlisting').css(
    //             { 'transform': 'translate(100%)' }
    //         );
    //     });
    // }
    saveUserDeliveryLocation() {
        if (this.latitude == null || this.longitude == null) {
            this.isError = true;
            this.latitude = null;
            this.userService.hideAppSpinner();
        } else {
            this.isError = false;
            const userPickupAddress = [{
                'geoLocation': {
                    'coordinates': [
                        this.longitude,
                        this.latitude
                    ],
                    'type': 'Point'
                },
                'address': this.formatted_address
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
                                        this.userDeliveryAddressToUse = data[0];
                                        this.userDeliveryAddress = data;
                                        this.userDeliveryAddressToUseAddressId = this.userDeliveryAddressToUse['id'];
                                        $('input[name=\'delivery\']').val('');
                                        $('body').trigger('click');
                                        this.userService.hideAppSpinner();
                                        this.userService.setHeaderCartCheck(true);
                                        this.latitude = null;
                                        this.getAllProducts('');
                                    });
                            },
                                error => {
                                    this.userService.showflashMessage('danger', 'Address already exists in your account. Please select the same and continue.');
                                    this.userService.hideAppSpinner();
                                });
                    },
                        error => {
                            this.userService.showflashMessage('danger', 'Address already exists in your account. Please select the same and continue.');
                            this.userService.hideAppSpinner();
                        });
            } else {
                this.userDeliveryAddress = userPickupAddress;
                this.userDeliveryAddressToUse = userPickupAddress[0];
                this.userDeliveryAddressToUseAddressId = this.userDeliveryAddressToUse['id'];
                $('input[name=\'delivery\']').val('');
                $('body').trigger('click');
                this.userService.setuserDeliveryLocation(userPickupAddress);
                this.userService.setuserDeliveryLocationToUse(userPickupAddress[0]);
                this.userService.hideAppSpinner();
                this.userService.setHeaderCartCheck(true);
                this.latitude = null;
                this.getAllProducts('');
            }
        }
    }
    ngOnDestroy() {
        this.userService.setProductListing(this.productListing, this.allProductListing);
        this.userService.setFilterListing(this.filterListing);
        this.userService.setOfferLoaded(true);
        this.storeState['isError'] = this.isError;
        this.storeState['productListing'] = this.productListing;
        this.storeState['filterListing'] = this.filterListing;
        this.storeState['allProductListing'] = this.allProductListing;
        this.storeState['tempProductListing'] = this.tempProductListing;
        this.storeState['productFilterArray'] = this.productFilterArray;
        this.storeState['breadcumbProductCategory'] = this.breadcumbProductCategory;
        this.storeState['latitude'] = this.latitude;
        this.storeState['longitude'] = this.longitude;
        this.storeState['formatted_address'] = this.formatted_address;
        this.storeState['classObject'] = this.classObject;
        this.storeState['sortingKey'] = this.sortingKey;
        this.storeState['sortingReverse'] = this.sortingReverse;
        this.storeState['sortingTypeSelected'] = this.sortingTypeSelected;
        this.storeState['productCount'] = this.productCountDisplay = this.productCount;
        this.storeState['scrollPosition'] = this.scrollPosition;
        this.storeState['allDataListWithFilters'] = this.allDataListWithFilters;
        this.storeState['record_Open_Azcordian'] = this.record_Open_Azcordian;
    }

    setAllValues(obj) {
        this.isError = this.storeState['isError'];
        this.productListing = this.storeState['productListing'];
        this.productListing.forEach(element => {
            element.loaded = false;
        });
        this.filterListing = this.storeState['filterListing'];
        this.allProductListing = this.storeState['allProductListing'];
        this.tempProductListing = this.storeState['tempProductListing'];
        this.productFilterArray = this.storeState['productFilterArray'];
        this.breadcumbProductCategory = this.storeState['breadcumbProductCategory'];
        this.latitude = this.storeState['latitude'];
        this.longitude = this.storeState['longitude'];
        this.formatted_address = this.storeState['formatted_address'];
        this.classObject = this.storeState['classObject'];
        this.sortingKey = this.storeState['sortingKey'];
        this.sortingReverse = this.storeState['sortingReverse'];
        this.sortingTypeSelected = this.storeState['sortingTypeSelected'];
        this.productCount = this.productCountDisplay = this.storeState['productCount'];
        this.scrollPosition = this.storeState['scrollPosition'];
        this.allDataListWithFilters = this.storeState['allDataListWithFilters'];
        this.record_Open_Azcordian = this.storeState['record_Open_Azcordian'];
        $('.' + this.breadcumbProductCategory.toLowerCase()).prop('checked', true);
               const tempRecord = this.record_Open_Azcordian;
        for (let i = 0; i < tempRecord.length; i++) {
            setTimeout(function () {
                $('#activeContentFilter' + tempRecord[i]).addClass('activeContentA');
                $('#activeContentFilterli' + tempRecord[i]).addClass('active');
            }, 2000);
        }
        this.userService.isSerachTerm.subscribe(searchText => {
            if (this.searchCount > 1) {
                this.breadcumbProductCategory = 'ALL';
                this.getAllProducts(searchText);
            } else {
                this.searchCount += 1;
            }
        });
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
            emailId: $('[name="email"]').val()
        };
        this.ProviderServiceService.getBartenders(bookingBartenderDetail).subscribe(res => {
            if (res.status == 200) {
                document.getElementById('request').click();               
            }
        });
    }
    goToHome() {
        this.router.navigate(['/']);
  }
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
    get email() { return this.barTenderForm.get('email'); }
}
