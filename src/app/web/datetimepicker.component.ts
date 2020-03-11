import { forwardRef, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, Component } from '@angular/core';
import { Moment } from 'moment-timezone';
declare var jQuery: any;

@Component({
    selector: 'my-datepicker',
    template: `<input readonly="true" style="max-width: 254px;margin: 0 auto;background-color: transparent;" id="datetimepicker" #input type="text" class="form-control mar-bot20" placeholder="Select a date & time">`
})
export class DatetimepickerComponent implements AfterViewInit {
    @ViewChild('input') input: ElementRef;
    public datepickerCheckInterval: any;
    ngAfterViewInit() {

        this.datepickerCheckInterval = setInterval(() => {
            if (typeof jQuery.datetimepicker != "undefined") {
                clearInterval(this.datepickerCheckInterval);

                let selectorInput = this.input.nativeElement;
                let openDatepickerFirstTime = true;
                jQuery(this.input.nativeElement).datetimepicker({
                    format: 'F d, Y l',
                    validateOnBlur: false,
                    forceParse: false,
                    minDate: 0,
                    step: 30,
                    timepicker: false,
                    onGenerate: function (ct) {
                        if (openDatepickerFirstTime) {
                            openDatepickerFirstTime = false;
                            jQuery(selectorInput).datetimepicker('show');
                        }
                    },
                    onClose: function (current_time, $input) {
                        if ($input.val() == "") {
                            $("#dateForServer").val('');
                        } else {
                            $("#dateForServer").val(new Date(current_time).toISOString());
                        }
                    }
                });
            }
        }, 10);
    }
}