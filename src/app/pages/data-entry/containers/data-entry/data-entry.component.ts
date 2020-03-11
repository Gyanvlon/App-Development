import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationStart } from '@angular/router';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.css']
})
export class DataEntryComponent implements OnInit {
  title = 'Distribution Point Data Manager';

  selectedOrganisationUnit = undefined;
  selectedWaterPoint = undefined;
  loading;
  loadingError;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    // this.db = new AngularIndexedDB('myDb', 1);
  }

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  previousDate: Date;

  authorities;
  init() {
    this.previousDate = new Date();
    this.previousDate = new Date(
      this.previousDate.getFullYear(),
      this.previousDate.getMonth() - 1,
      1
    );
    this.userService.getAuthorities().subscribe(authorities => {
      this.authorities = authorities;
    });
  }

  ngOnInit() {
    this.init();
  }

  onOrganisationUnitInitialized(event) {
    if (this.router.url.indexOf('/orgUnit/') == -1) {
      this.openOrganisationUnit(event);
    }
  }

  onOrganisationUnitSelect(event) {
    this.openOrganisationUnit(event);
  }

  openOrganisationUnit(event) {
    let orgUnits = event.value.split(';');
    let orgUnitId = orgUnits[0];
    if (orgUnits.length > 1) {
      orgUnitId = orgUnits[orgUnits.length - 1];
    }
    var beginning = '';
    var end = '';

    let url = [];
    if (orgUnits.length === 1) {
      url = [beginning + 'orgUnit', orgUnits[0] + end];
    } else {
      url = [beginning + 'orgUnit', orgUnits[1], 'level', orgUnits[0].replace('LEVEL-', '')];
    }
    if (this.router.url.indexOf('/period') > -1) {
      end = this.router.url.substr(this.router.url.indexOf('/period'));
      end
        .substr(1)
        .split('/')
        .forEach(u => {
          url.push(u);
        });
    }
    this.router.navigate(url, { relativeTo: this.route });
  }

  onPeriodUpdate(period) {
    let url = this.router.url;
    if (url.indexOf('/period/') > -1) {
      url = url.substr(0, url.indexOf('/period/'));
    }
    this.router.navigate([url, 'period', period.value]);
  }
  showOrganisationUnitDetails(event) {
    this.selectedOrganisationUnit = event.node.data;
  }

  showWaterPoint(event) {
    this.selectedWaterPoint = event;
  }

  ngAfterViewInit() {}
}
