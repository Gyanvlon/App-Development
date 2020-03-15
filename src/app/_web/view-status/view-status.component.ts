import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css']
})
export class ViewStatusComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.demoSimulation').addClass('active');
    });
  }
  ngOnDestroy() {
    $(function () {
      // console.log('im active');
      $('.navbar-default li.demoSimulation').removeClass('active');
    });
  }

}
