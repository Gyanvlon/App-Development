import { Component, OnInit, Input } from '@angular/core';
import { Response } from '@angular/http';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() messageObject;
  @Input() type;
  constructor() {}

  messageSet;
  isError: boolean;
  ngOnInit() {
    if (this.messageObject instanceof Response) {
      this.messageObject = this.messageObject.json();
    }
    this.isError = this.type !== 'success';
    const codeMessage = this.isError ? ' (Error Code ' : ' (Status Code ';
    if (
      this.messageObject.status &&
      this.messageObject.message &&
      this.messageObject.statusText
    ) {
      this.messageSet = {
        heading:
          this.messageObject.statusText +
          codeMessage +
          this.messageObject.status +
          ')!',
        message: this.messageObject.message
      };
    } else if (this.messageObject.status === 0) {
      this.messageSet = {
        heading: 'Network Error!',
        message: 'Failed to load. Please check the your internet connection.'
      };
    } else if (this.messageObject.status === 403) {
      this.messageSet = {
        heading: 'Access Error!',
        message:
          'Failed to load. You do not have access. Please contact administrator to gain this privilege'
      };
    } else if (
      this.messageObject.status === 409 ||
      this.messageObject.httpStatusCode === 409
    ) {
      const dhisMessage = this.messageObject;
      console.log('Error:', dhisMessage);
      if (
        dhisMessage.message.indexOf('User is not allowed to view org unit') > -1
      ) {
        this.messageSet = {
          heading: 'Access Error!',
          message:
            'You do not have access to this distribution point. Please contact administrator.'
        };
      } else if (
        dhisMessage.message.indexOf('No row with the given identifier exists') >
        -1
      ) {
        this.messageSet = {
          heading: 'Database Error!',
          message:
            'There is a database error. Please contact administrator. No row with the given identifier exists'
        };
      } else if (
        dhisMessage.message &&
        dhisMessage.httpStatus &&
        dhisMessage.httpStatusCode
      ) {
        this.messageSet = {
          type: 'danger',
          message: dhisMessage.message,
          heading:
            dhisMessage.httpStatus +
            codeMessage +
            dhisMessage.httpStatusCode +
            ')!'
        };
      } else {
        if (dhisMessage.response) {
          if (dhisMessage.response.conflicts) {
            let message = '';
            dhisMessage.response.conflicts.forEach(conflict => {
              message += conflict.value.split('_').join(' ');
            });
            this.messageSet = { heading: 'Error!', message: message };
          } else if (dhisMessage.response.errorReports) {
            let message = '';
            dhisMessage.response.errorReports.forEach((errorReport, index) => {
              if (index > 0) {
                message += ', ';
              }
              message += errorReport.message;
            });
            this.messageSet = {
              heading: 'Error!',
              message: message,
              type: 'danger'
            };
          }
        } else {
          this.messageSet = {
            heading: 'Error!',
            message:
              'There is a system conflict. Please contact administrator to be assigned to this distribution point.'
          };
        }
      }
    } else if (
      this.messageObject.status === 500 ||
      this.messageObject.httpStatusCode === 500
    ) {
      const dhisMessage = this.messageObject;
      if (
        dhisMessage.message.indexOf('No row with the given identifier exists')
      ) {
        this.messageSet = {
          heading: 'Database Error!',
          message:
            'There is a database error. Please contact administrator to be assigned to this distribution point.'
        };
      } else {
        if (this.messageObject.httpStatusCode) {
          this.messageSet = {
            heading: 'Error!',
            message: this.messageObject.message
          };
        } else {
          this.messageSet = {
            heading: 'System Error!',
            message:
              'There is a system error. Please contact administrator to be assigned to this distribution point.'
          };
        }
      }
    } else {
      this.messageSet = this.messageObject;
    }
  }
  reload() {
    window.location.reload();
  }
}
