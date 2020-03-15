import { ApiService } from './../../Services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-request-listing-page',
  templateUrl: './support-request-listing-page.component.html',
  styleUrls: ['./support-request-listing-page.component.css']
})
export class SupportRequestListingPageComponent implements OnInit {
  projectDetail;
  constructor(private apiService: ApiService) {
    this.apiService.getAllProject().subscribe(data => {
      this.projectDetail = data.data;
      console.log(this.projectDetail);
    })
  }
  ngOnInit() {
  }

}
