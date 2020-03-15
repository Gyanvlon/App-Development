import { Injectable } from '@angular/core';
import * as moment from 'moment'; // to formt data from api

@Injectable({
  providedIn: 'root'
})
export class ConvertTimeService {
  timeZoneOffset;
  convertedTime;

  constructor() { }

  getTime(userTime) {
    const time = new Date();
    this.timeZoneOffset = time.getTimezoneOffset();
    console.log(this.timeZoneOffset);

    this.convertedTime = moment.utc(userTime).zone(-(this.timeZoneOffset)).format();
    console.log(this.convertedTime);
  }
}
