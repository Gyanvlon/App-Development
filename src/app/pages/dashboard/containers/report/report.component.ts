import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import * as _ from 'lodash';
import { Visualization } from '../../../../core/models/visualization.model';
import { CurrentUser } from '../../../../core/models/current-user.model';
import { HttpClientService } from '../../../../core/services/http-client.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {
  @Input()
  visualizationObjects: Visualization[];
  @Input()
  currentUser: CurrentUser;
  @Input()
  loading = true;
  @Input()
  globalFilter: any;
  have_authorities = true;
  show_warning_message = false;
  show_other_warning_message = false;
  show_sending_message = false;
  show_other_sending_message = false;
  user_email = '';
  user_id = '';
  dateGenerated: any;
  showGenerationDate = false;

  constructor(private httpClient: HttpClientService) {}

  ngOnInit() {
    if (this.currentUser) {
      this.user_id = this.currentUser.id;
      if (this.currentUser.hasOwnProperty('email')) {
        if (this.currentUser.email.replace(/ /g, '') !== '') {
          this.user_email = this.currentUser.email;
        }
      }
      this.currentUser.userCredentials.userRoles.forEach(role => {
        role.authorities.forEach(ath => {
          if (ath === 'ALL') {
            this.have_authorities = true;
          }
        });
      });
    }
  }

  // controling the button to send the email to all users
  enableSendEmail() {
    this.httpClient.get('dataStore/emails/enable').subscribe(
      data => {
        this.httpClient
          .put('dataStore/emails/enable', { enabled: true })
          .subscribe(item => {
            this.show_warning_message = false;
            this.show_sending_message = true;
            setTimeout(() => {
              this.show_sending_message = false;
            }, 6000);
          });
      },
      error => {
        this.httpClient
          .put('dataStore/emails/enable', { enabled: true })
          .subscribe(item => {
            this.show_warning_message = false;
            this.show_sending_message = true;
            setTimeout(() => {
              this.show_sending_message = false;
            }, 6000);
          });
      }
    );
  }

  // controlling the button to send email to specific user
  enableSendUserEmail() {
    const sanitizedGlobalFilter = {
      ou:
        this.globalFilter && this.globalFilter.ou
          ? {
              ...this.globalFilter.ou,
              id: _.filter(
                this.globalFilter.ou.id.split(';') || [],
                (value: any) =>
                  value.indexOf('LEVEL-') === -1 &&
                  value.indexOf('GROUP') === -1
              )[0]
            }
          : null,
      pe:
        this.globalFilter && this.globalFilter.pe ? this.globalFilter.pe : null
    };
    console.log("Period:", this.globalFilter.pe.id);
    this.httpClient.get('dataStore/users/' + this.user_id + '_' + this.globalFilter.pe.id).subscribe(
      data => {
        this.httpClient
          .put('dataStore/users/' + this.user_id + '_' + this.globalFilter.pe.id, sanitizedGlobalFilter)
          .subscribe(item => {
            this.show_other_warning_message = false;
            this.show_other_sending_message = true;
            setTimeout(() => {
              this.show_other_sending_message = false;
            }, 6000);
          });
      },
      () => {
        this.httpClient
          .post('dataStore/users/' + this.user_id + '_' + this.globalFilter.pe.id, sanitizedGlobalFilter)
          .subscribe(() => {
            this.show_other_warning_message = false;
            this.show_other_sending_message = true;
            setTimeout(() => {
              this.show_other_sending_message = false;
            }, 6000);
          });
      }
    );
  }
}
