import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'daysLeft' })
export class DaysLeftPipe implements PipeTransform {

    transform(futureDate: Date): string {
        let date1 = new Date(futureDate);
        let date2 = new Date();

        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime()
        var date2_ms = date2.getTime()

        // Calculate the difference in milliseconds
        //var difference_ms = Math.abs(date1_ms - date2_ms)
        var difference_ms = date1_ms - date2_ms;

        if (difference_ms < 0) {
            return "Offer ended";
        } else {
            // Convert back to days and return
            return Math.round(difference_ms / ONE_DAY).toString() + " DAYS LEFT";
        }
    }

}
