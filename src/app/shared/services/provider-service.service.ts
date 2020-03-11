import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'
import { Injectable, OnInit } from '@angular/core';
import { API_URL, GOOGLE_API_KEY, MILES_TO_RADIAN, USER_MILES, STRIPE_URL } from '../../constants/constants';
import { UserService } from '../../shared/services/user.service';
import request from 'request';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

@Injectable()
export class ProviderServiceService {
    public headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
    });
    public options = new RequestOptions({ headers: this.headers });
    public userCurrentLocation: any = {};
    public establishmentQuery: string = "";
    public establishmentID: any;

    constructor(
        private _http: Http,
        private userService: UserService,
        private router: Router
    ) { }

    public getOfferDetails(offerId: string) {
        return this._http.get(API_URL + 'offers?filter={"where":{"id":"' + offerId + '"},"include":[{"product":["productPhoto"]},"establishment"]}')
            .map((res: Response) => res.json());
    }

    public getOrderDetails(offerId: string) {
        return this._http.get(API_URL + 'orders?filter={"where":{"id":"' + offerId + '"},"include":["transactions","account","establishment",{"orderdetails":{"offer":[{"product":["productPhoto"]}]}}]}')
            .map((res: Response) => res.json());
    }

    public getEstablishmentDetails(establishmentId: string) {
        return this._http.get(API_URL + 'establishments/' + establishmentId)
            .map((res: Response) => res.json());
    }

    public getEstablishmentDistance(establishmentId: string, latitude: number, longitude: number) {
        return this._http.get(API_URL + 'bevviutils/getEstDistance?latitude=' + latitude + '&longitude=' + longitude + '&establishmentId=' + establishmentId + '&transit=' + this.userService.getUserTransportmode())
            .map((res: Response) => res.json());
    }

    public getStoreListing(userCurrentLocation: any, userPickupAddress: any) {
        userCurrentLocation.latitude = 40.7665970460951;
        userCurrentLocation.longitude = -73.99065751844098;
        // userCurrentLocation.latitude = userCurrentLocation.coords.latitude;
        // userCurrentLocation.longitude = userCurrentLocation.coords.longitude;
        let radian: number = this.userService.getUserRadiusMiles() / MILES_TO_RADIAN;
        let meters: number = this.userService.getUserRadiusMiles() * 1609.344;

        return this._http.get(API_URL + 'establishments/geoSearchWithDistance?latitude=' + userPickupAddress.geoLocation.coordinates[1] + '&longitude=' + userPickupAddress.geoLocation.coordinates[0] + '&curlat=' + userCurrentLocation.latitude + '&curlng=' + userCurrentLocation.longitude + '&maxdistance=' + meters + '&transit=1&limit=10')
            .map((res: Response) => res.json());
    }

    public getProductListing(establishmentId: Array<any>) {
        let estQuery: Array<any> = [];
        establishmentId.forEach((establishment) => {
            let estObject = { "establishmentId": establishment };
            estQuery.push(estObject);
        }
        );
        return this._http.get(API_URL + 'offers?filter={"where":{"or":' + JSON.stringify(estQuery) + ', "endsAt":{"gte":"' + new Date().toUTCString() + '"}, "active": true}, "include":[{"product":["productPhoto"]},"establishment"]}')
            .map((res: Response) => res.json());
    }

    public getAddressFromIP(userCoordinates: any) {
        return this._http.get('https://maps.googleapis.com/maps/api/geocode/json?location_type=ROOFTOP&result_type=street_address&latlng=' + userCoordinates.coords.latitude + ',' + userCoordinates.coords.longitude + '&key=' + GOOGLE_API_KEY)
            .map((res: Response) => res.json());
    }

    public getDistanceFromIP(userAddress: any, establishmentAddress: any) {
        return this._http.post('https://maps.googleapis.com/maps/api/distancematrix/json?origins=New york, USA&destinations=' + establishmentAddress + '&key=' + GOOGLE_API_KEY, {})
            .map((res: Response) => res.json());
    }

    public addToShoppingCart(cartData: any) {
        if (this.userService.isLoggedIn) {
            return this._http.get(API_URL + 'shoppingcarts/addOrUpdate?accountId=' + cartData.accountId + '&quantity=' + cartData.quantity + '&productId=' + cartData.productId + '&offerId=' + cartData.offerId + '&establishmentId=' + cartData.establishmentId)
                .map((res: Response) => res.json());
        } else {
            this.userService.setCartLocalStorage(cartData);
        }
    }

    public updateShoppingCart(cartId, quantity) {
        return this._http.put(API_URL + 'shoppingcarts/' + cartId, { "quantity": quantity })
            .map((res: Response) => res.json());
    }

    public removeItemShoppingCart(cartId: any) {
        return this._http.post(API_URL + 'shoppingcarts/update?where={"id" : "' + cartId + '" , "state": 0}', { state: 4 })
            .map((res: Response) => res.json());
    }

    public emptyShoppingCart(updateState: number) {
        //this.userService.setCartCheck(true);
        return this._http.post(API_URL + 'shoppingcarts/update?where={"accountId" : "' + this.userService.getCurrentAccountId() + '" , "state": 0}', { state: updateState })
            .map((res: Response) => res.json());
    }

    public login(loginDetails: any) {
        return this._http.post(API_URL + 'accounts/login', loginDetails)
            .map((res: Response) => res.json());
    }

    public emailLogin(email: string, password: string) {
        return this._http.get(API_URL + 'bevviutils/emailLogin?emailId=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password), this.options)
            .map((res: Response) => res.json());
    }

    public signup(signupDetails: any) {
        return this._http.post(API_URL + 'accounts', signupDetails)
            .map((res: Response) => res.json());
    }
    public updateProfile(updatedDetails: any) {
        return this._http.patch(API_URL + 'accounts/' + this.userService.getCurrentAccountId() + '?access_token=' + this.userService.getAccessToken(), updatedDetails)
            .map((res: Response) => res.json());
    }
    public getAccountData(accountId: string) {
        return this._http.get(API_URL + 'accounts/' + accountId + '?filter={"include":["paymentIds","userProfiles"]}&access_token=' + this.userService.getAccessToken())
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.userService.unsetAllData();
                    this.router.navigate(['/']);
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }
    public getShoppingCart() {
        return this._http.get(API_URL + 'shoppingcarts?filter={"where":{"accountId":"' + this.userService.getCurrentAccountId() + '","state":0},"include":[{"product":["productPhoto"]},{"offer":["establishment"]}]}')
            .map((res: Response) => res.json());
    }
    public getShoppingCartCount() {
        return this._http.get(API_URL + 'shoppingcarts/count?where={"accountId":"' + this.userService.getCurrentAccountId() + '", "state":0}')
            .map((res: Response) => res.json());
    }
    public checkSocialCredential(facebookId: string) {
        return this._http.get(API_URL + 'socialCredentials?filter={"where":{"facebookId":"' + facebookId + '"}}')
            .map((res: Response) => res.json());
    }
    public createSocialCredential(facebookId: string, accountId: string) {
        return this._http.post(API_URL + 'socialCredentials', { facebookId: facebookId, accountId: accountId })
            .map((res: Response) => res.json());
    }
    public uploadCartItemFromLocalStorage() {
        let cartDataLocal = this.userService.getCartLocalStorage();
        let cartDataArray: Array<any> = [];
        cartDataLocal.forEach(cartItem => {
            let cartsingle: any = {};
            cartsingle.offerId = cartItem.offer.id;
            cartsingle.productId = cartItem.offer.productId;
            cartsingle.quantity = parseInt(cartItem.quantity);
            cartsingle.accountId = this.userService.getCurrentAccountId();
            cartsingle.establishmentId = cartItem.offer.establishmentId;
            cartDataArray.push(cartsingle);
        });
        return this._http.get(API_URL + 'shoppingcarts/addUpdateCart?items=' + JSON.stringify(cartDataArray))
            .map((res: Response) => res.json());
    }
    public syncUserCartData(callback) {
        this.getShoppingCart()
            .subscribe(data => {
                let getCartLocalStorage = this.userService.getCartLocalStorage();
                let serverCartEstablishmentId = "";
                let localStorageCartEstablishmentId = "";
                let serverDataLength = data.length;
                let localDataLength = getCartLocalStorage.length;

                if (serverDataLength > 0 && localDataLength > 0) {
                    serverCartEstablishmentId = data[0].offer.establishmentId;
                    localStorageCartEstablishmentId = getCartLocalStorage[0].offer.establishmentId;
                    if (serverCartEstablishmentId == localStorageCartEstablishmentId) {
                        this.uploadCartItemFromLocalStorage()
                            .subscribe(data => {
                                this.userService.unsetCartLocalStorage();
                                callback();
                            })

                    } else {
                        if (confirm("Cart contains items from a different liquor store. Would you like to empty your cart and add new item?")) {
                            this.emptyShoppingCart(4)
                                .subscribe(data => {
                                    this.uploadCartItemFromLocalStorage()
                                        .subscribe(data => {
                                            this.userService.unsetCartLocalStorage();
                                            callback();
                                        });
                                });
                        } else {
                            this.userService.unsetCartLocalStorage();
                            callback();
                        }
                    }
                } else if (serverDataLength > 0 && localDataLength == 0) {
                    localStorage.setItem('shoppingCartData', this.userService.encrypt(JSON.stringify(data)));
                    if (data.length > 0) {
                        this.userService.setCartEstablishmentId(data[0].offer.establishmentId);
                    }
                    callback();
                } else if (serverDataLength == 0 && localDataLength > 0) {
                    this.uploadCartItemFromLocalStorage()
                        .subscribe(data => {
                            this.userService.unsetCartLocalStorage();
                            callback();
                        });
                } else {
                    callback();
                }
            });
    }

    public getCurrentAddress(latitude: number, longitude: number, callback: Function) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + GOOGLE_API_KEY;

        request(url, (error, response, body) => {
            if (JSON.parse(body).status == "OK") {
                let address: any = {};//this.userService.parseAddress(JSON.parse(body).results[0].formatted_address)
                address.latitude = latitude;
                address.longitude = longitude;
                address.formatted_address = JSON.parse(body).results[0].formatted_address
                callback(true, address)
            }
            else {
                callback(false, JSON.parse(body).status);
            }
        });
    }

    public addLocation(latitude: number, longitude: number) {
        if (latitude == 0 || longitude == 0) {
            return Observable.of(1);
        }
        return this._http.post(API_URL + 'locations', {
            geoLocation: {
                type: "Point",
                coordinates: [
                    longitude,
                    latitude
                ]
            }
        }).map((res: Response) => res.json());
    }
    public addUserDeliveryLocation(latitude: number, longitude: number, address: string, locationId: string) {
        if (latitude == 0 || longitude == 0) {
            return Observable.of(1);
        }
        return this._http.post(API_URL + 'deliverylocations', {
            geoLocation: {
                type: "Point",
                coordinates: [
                    longitude,
                    latitude
                ]
            },
            address: address,
            accountId: this.userService.getCurrentAccountId(),
            locationId: locationId
        }).map((res: Response) => res.json());
    }

    public getuserDeliveryLocation() {
        return this._http.get(API_URL + 'deliverylocations?filter={"where":{"accountId":"' + this.userService.getCurrentAccountId() + '"},"order":"createdAt desc"}')
            .map((res: Response) => res.json());
    }

    public getUserOrders() {
        return this._http.get(API_URL + 'orders?filter={"where":{"accountId":"' + this.userService.getCurrentAccountId() + '"},"order":"createdAt desc","include":[{"orderdetails":["product"]},"establishment"]}')
            .map((res: Response) => res.json());
    }

    public getUserSavedCards(callback) {
        let cust_Id = this.userService.getCurrentUserPayment();
        var options = {
            method: 'POST',
            url: STRIPE_URL + "retrieve_customer",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: { customerId: cust_Id }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            callback(JSON.parse(body));
        });
    }

    public addUserSavedCards(card_details, callback) {
        var options = {
            method: 'POST',
            url: STRIPE_URL + "create_card",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {
                customerId: this.userService.getCurrentUserPayment(),
                number: card_details.number,
                exp_month: card_details.exp_month,
                exp_year: card_details.exp_year,
                cvc: card_details.cvc,
                name: card_details.name,
                zip: card_details.zipcode
            }
        };

        request(options, function (error, response, body) {
            callback(JSON.parse(body));
        });
    }

    public deleteUserSavedCards(sourceId, callback) {
        var options = {
            method: 'POST',
            url: STRIPE_URL + "delete_card",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: { customerId: this.userService.getCurrentUserPayment(), sourceId: sourceId }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            callback(JSON.parse(body));
        });
    }

    public create_charge(final_details, callback) {
        var options = {
            method: 'POST',
            url: STRIPE_URL + "create_charge_b2b",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: final_details
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            callback(JSON.parse(body));
        });
    }

    public create_charge_multiple(final_details, callback) {
        var options = {
            method: 'POST',
            url: STRIPE_URL + "create_charge_multiple",
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: final_details
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            callback(JSON.parse(body));
        });
    }

    public getTaxFromLatLong(latitude: number, longitude: number, callback) {
        var options = {
            method: 'GET',
            url: STRIPE_URL + "getTaxRate/" + latitude + "/" + longitude,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            callback(JSON.parse(body));
        });
    }

    public getUserPoints() {
        return this._http.get(API_URL + 'accounts/getPoints?accountId=' + this.userService.getCurrentAccountId() + '&access_token=' + this.userService.getAccessToken())
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.userService.unsetAllData();
                    this.router.navigate(['/']);
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public sendForgotPasswordRequest(userEmail: string) {
        return this._http.get(API_URL + 'bevviemails/{id}/sendEmail?type=0&emailId=' + userEmail)
            .map((res: Response) => res.json());
    }

    public getProductRating(productId: string) {
        return this._http.get(API_URL + 'products/getRating?productId=' + productId)
            .map((res: Response) => res.json());
    }

    public submitProductRating(rating: number, productId: string) {
        return this._http.post(API_URL + 'ratings', { productId: productId, accountId: this.userService.getCurrentAccountId(), rating: rating })
            .map((res: Response) => res.json());
    }

    public getUserDiscountInfo(promoCode: string = "") {
        let api_url = "accounts/getDiscountInfo?accountId=" + this.userService.getCurrentAccountId() + "&access_token=" + this.userService.getAccessToken();
        if (promoCode != "") {
            api_url += "&promoCode=" + promoCode;
        }
        return this._http.get(API_URL + api_url)
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.router.navigate(['/']);
                    this.userService.unsetAllData();
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public reset_password(password: string, accountId: string, accessToken: string) {
        return this._http.patch(API_URL + 'accounts/' + accountId + '?access_token=' + accessToken, { "password": password })
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.userService.unsetAllData();
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public getUserProductsToRate() {
        return this._http.get(API_URL + 'accounts/getProductsToRate?accountId=' + this.userService.getCurrentAccountId() + '&access_token=' + this.userService.getAccessToken())
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.router.navigate(['/']);
                    this.userService.unsetAllData();
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public preCheckoutShoppingCart() {
        return this._http.get(API_URL + 'shoppingcarts/precheckout?accountId=' + this.userService.getCurrentAccountId())
            .map((res: Response) => res.json());
    }

    public getEstablishmentStripeAccount(establishmentId: string) {
        return this._http.get(API_URL + 'establishments?filter={"where":{"id":"' + establishmentId + '"},"include":{"bizaccount":["paymentIds"]}}')
            .map((res: Response) => res.json());
    }

    public logout() {
        return this._http.post(API_URL + 'accounts/logout?access_token=' + this.userService.getAccessToken(), {})
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.userService.unsetAllData();
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public bringBevviToCity(email: string, address: string) {
        return this._http.get(API_URL + 'bevviemails/{id}/sendEmail?type=1&emailId=' + email + '&subject=' + address)
            .map((res: Response) => res.json());
    }

    public updateUserProfile(radius: number, transport: number) {
        return this._http.post(API_URL + 'userProfiles/upsertWithWhere?where={"accountId" : "' + this.userService.getCurrentAccountId() + '"}', { radius: radius, transport: transport, accountId: this.userService.getCurrentAccountId() })
            .map((res: Response) => res.json())
    }

    public getMainImage() {
        return this._http.get(API_URL + 'bevviutils/getMainImage')
            .map((res: Response) => res.json());
    }

    public getPartnerImages() {
        return this._http.get(API_URL + 'bevviutils/getPartnerImages')
            .map((res: Response) => res.json());
    }

    public setUserDefaultCard(sourceId, callback) {
        var options = {
            method: 'POST',
            url: STRIPE_URL + 'update_customer',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            form: {
                customerId: this.userService.getCurrentUserPayment(),
                sourceId: sourceId
            }
        };

        request(options, function (error, response, body) {
            if (error) { throw new Error(error); }
            callback(JSON.parse(body));
        });
    }

    public getCurrentOffers(deliveryAddress: any, searchText: any = '') {
        let inputParams = {};
        if (this.userService.isLoggedIn()) {
            inputParams['accountId'] = this.userService.getCurrentAccountId();
        } else {
            inputParams['geoLocation'] = deliveryAddress.geoLocation;
        }
        if (searchText != '') {
            inputParams['searchBy'] = searchText;
        }
        return this._http.get(API_URL + 'offers/getCurrentOffersNew?inparams=' + JSON.stringify(inputParams))
            .map((res: Response) => res.json());
    }

    public getDeliveryFees() {
        return this._http.get(API_URL + 'orders/getDeliveryFee?accountId=' + this.userService.getCurrentAccountId())
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.userService.unsetAllData();
                    this.router.navigate(['/']);
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public validateDeliveryDate(date: string, establishmentId) {
        return this._http.get(API_URL + 'bevviutils/validateDeliveryDate?establishmentId=' + establishmentId + '&date=' + date + '&access_token=' + this.userService.getAccessToken())
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.router.navigate(['/']);
                    this.userService.unsetAllData();
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public getDeliveryDates(date: string) {
        return this._http.get(API_URL + 'bevviutils/getDeliveryDates?accountId=' + this.userService.getCurrentAccountId() + '&date=' + date + '&access_token=' + this.userService.getAccessToken())
            .map((response: Response) => {
                let runs = response.json();
                return runs;
            })
            .catch(e => {
                if (e.status === 401) {
                    this.userService.unsetAllData();
                    return Observable.throw('Unauthorized');
                }
                // do any other checking for statuses here
            });
    }

    public subscribeToNewsLetter(userData: any) {
        return this._http.post(API_URL + 'EmailRepos', userData)
            .map((res: Response) => res.json());
    }
    // new added for bartenders
    public getBartenders(bookingBarTenderDetail) {
        return this._http.put(API_URL + 'bartenders', bookingBarTenderDetail);
    }
    // getEstablishmentId(id) {
    //     console.log(id);
    //     this.establishmentID = id;
    //     console.log(this.establishmentID);
    //     return this.establishmentID;
    // }
    public getDeliveryMessage (establishmentID) {
        console.log(establishmentID);
        return this._http.get(API_URL + 'bevviutils/getMinAmountForDelivery?establishmentId=' + establishmentID);
    }
}

