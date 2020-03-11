import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import { Directive, Input } from '@angular/core';
declare var google: any;



@Directive({
    selector: 'sebm-google-map-directions'
})
export class DirectionsMapDirective {
    @Input() origin;
    @Input() destination;
    @Input() directionsDisplay;
    constructor(private gmapsApi: GoogleMapsAPIWrapper) { }
    ngOnInit() {
        this.gmapsApi.getNativeMap().then(map => {
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setMap(map);
            directionsService.route({
                origin: { lat: this.origin.latitude, lng: this.origin.longitude },
                destination: { lat: this.destination.latitude, lng: this.destination.longitude },
                waypoints: [],
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });

        });
    }

    ngOnChanges(changes) {
        this.gmapsApi.getNativeMap().then(map => {
            var directionsService = new google.maps.DirectionsService;
            this.directionsDisplay.addListener('directions_changed', function () {
                this.computeTotalDistance(this.directionsDisplay.getDirections());
            });

            this.directionsDisplay.setMap(map);
            directionsService.route({
                origin: { lat: this.origin.latitude, lng: this.origin.longitude },
                destination: { lat: this.destination.latitude, lng: this.destination.longitude },
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function (response, status) {
                if (status === 'OK') {
                    //directionsDisplay.setDirections({routes: []});
                    this.directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        })
    }

    computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
            total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        document.getElementById('trip_length').innerHTML = 'The trip is <span id="trip_length_nr">' + total + '</span>km long.';
    }
}