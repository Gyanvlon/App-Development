import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-loader',
  templateUrl: './map-loader.component.html',
  styleUrls: ['./map-loader.component.css'],
  styles: [
    `:host {
      display: block;
      width: 100%;
      height: 100%;
    }
  }`
  ]
})
export class MapLoaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
