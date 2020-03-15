import { ApiService } from './../Services/api.service';
import { LocalstorageService } from './../Services/localstorage.service';
import { LocalStorageDataService } from './../Services/local-storage-data.service';

import { AuthenticationService } from './../Services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExternaljsService } from '../shared/externaljs.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent implements OnInit {
  public imageSrc: any = '/assets/img/prf-img.png';
  public isSuperAdmin;
  public stakeholderId: any;
  public currentUserDetail: any;
  public image: any;
  public stakeholderDetail: any;
  constructor(public authenticationService: AuthenticationService, private router: Router,
    private externaljsService: ExternaljsService,
    private localstorageService: LocalstorageService,
    private apiService: ApiService
  ) { 
    setTimeout(() => {
      this.externaljsService.initializedInspinia();
    }, 1200);
  }

  ngOnInit() {
    this.currentUserDetail = this.authenticationService.currentUserDetail();
    this.stakeholderId = this.currentUserDetail.userId;
    this.apiService.stakeholderProfile(this.stakeholderId).subscribe(res => {
      this.stakeholderDetail = res.data;
      this.image = this.stakeholderDetail.stakeholderImage === null ? this.imageSrc : this.stakeholderDetail.stakeholderImage;
      console.log(this.stakeholderDetail);
      setTimeout(() => {
       this.externaljsService.initializedInspinia();
      }, 1000);

      // $('.hideButton').click(function() {
      //     $('body').toggleClass('mini-navbar');
      //     SmoothlyMenu();
      // });
      this.isSuperAdmin = this.localstorageService.superadminLogin;
    });
  }
  logout() {
    this.authenticationService.logOut().subscribe(
      res => {
        if (res.status === 200) {
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
        }
      },
      error => {
        console.log('ERROR');
      }
    );
  }
  // loadJs() {
  //   console.log('here is js load');
  //   this.externaljsService.initializedInspinia();
  // }

  // SmoothlyMenu() {
  //       if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
  //           // Hide menu in order to smoothly turn on when maximize menu
  //           $('#side-menu').hide();
  //           // For smoothly turn on menu
  //           setTimeout(
  //               // tslint:disable-next-line:only-arrow-functions
  //               function() {
  //                   $('#side-menu').fadeIn(400);
  //               }, 200);
  //       } else if ($('body').hasClass('fixed-sidebar')) {
  //           $('#side-menu').hide();
  //           setTimeout(
  //               // tslint:disable-next-line:only-arrow-functions
  //               function() {
  //                   $('#side-menu').fadeIn(400);
  //               }, 100);
  //       } else {
  //           // Remove all inline style from jquery fadeIn function to reset menu state
  //           $('#side-menu').removeAttr('style');
  //       }
  //   }
}

