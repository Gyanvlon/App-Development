import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(
        angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        private router: Router
    ) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

    ngAfterViewInit() {
        new SmartBanner({
            daysHidden: 0,
            daysReminder: 0,
            appStoreLanguage: 'us',
            title: 'Bevvi',
            author: 'Etail Inc',
            button: 'VIEW',
            store: {
                ios: 'On the App Store',
                android: 'In Google Play'
            },
            price: {
                ios: 'FREE',
                android: 'FREE'
            }
        });
    }
    title = 'Bevvi';
}
