import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.css']
})
export class YearPickerComponent implements OnInit {
  @Input() initialValue: any;
  years: any[] = [];
  private yy: number;

  @Output() yearSelected = new EventEmitter();

  ngOnInit() {
    this.getYear();
  }

  getYear() {
    const today = new Date();
    this.yy = today.getFullYear();
    for (let i = this.yy - 100; i <= this.yy; i++) {
      this.years.push({ text: '' + i, value: '' + i });
    }
    this.years = _.reverse(this.years);
  }

  selected(year) {
    this.yearSelected.emit(year);
  }
}
