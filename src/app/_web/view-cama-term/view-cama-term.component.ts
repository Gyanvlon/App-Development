import { ApiService } from './../../Services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-cama-term',
  templateUrl: './view-cama-term.component.html',
  styleUrls: ['./view-cama-term.component.css']
})
export class ViewCamaTermComponent implements OnInit, OnDestroy {
  public projectId: any;
  public camaTerm: any;
  public blank: boolean = false;

  constructor(public route: ActivatedRoute, public apiService: ApiService) {
    route.params.subscribe(val => {
      this.projectId = this.route.snapshot.paramMap.get('id');
      console.log(this.projectId);
      this.getData(this.projectId);
    });
  }
  getData(projectId) {
    this.apiService.camatermByProject(projectId).subscribe(res => {
      this.camaTerm = res.data;
      console.log(this.camaTerm);

      if (this.camaTerm == '0') {
        this.blank = true;
      }
    },
      error => {
        console.log(error);
        this.blank = true;
      });
  }

  getDeleteActiveId() {
  }
  ngOnInit() {
    $(function () {
      console.log('im active');
      $('.navbar-default li.manageProject').addClass('active');
    });
  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.manageProject').removeClass('active');
    });
  }

}
