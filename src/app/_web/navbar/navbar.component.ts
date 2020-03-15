import { NavbarAuthServiceService } from '../../Services/navbar-auth-service.service';
import { AuthGuard } from '../../_guard/auth.guard';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navBarVisibleStatus;

  constructor(private navbarAuthServiceService: NavbarAuthServiceService, private loginGuard: AuthGuard) {

  }

  ngOnInit() {
    this.navbarAuthServiceService.loggedIn.subscribe(data => {
      console.log(data);

      this.navBarVisibleStatus = data;
    });
  }

}
