import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { HttpClientService } from '../../../../core';
import { GlobalFilter } from '../../../../core/models/global-filter.model';
import { Program } from '../../../../core/models/program.model';
import { PROGRAM_ID } from '../../../../core/utils/constants.util';
import { AppState, LoadingOrganisationUnitAction, ResetMessageObjectOnOrganisationUnitAction } from '../../../../store';
import * as eventsActions from '../../../../store/actions/event.actions';
import { getAttributes } from '../../../../store/selectors';
import { getCompletenessNotification } from '../../../../store/selectors/event.selector';
import { getCurrentGlobalFilter } from '../../../../store/selectors/global-filter.selectors';
import { getCurrentProgram } from '../../../../store/selectors/program.selector';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'app-water-point',
  templateUrl: './water-point.component.html',
  styleUrls: ['./water-point.component.css']
})
export class WaterPointComponent implements OnInit {
  @Input() id;
  @Input() parentId;
  private ou;
  private pe;
  private loading;
  private organisationUnit;
  private programId: string = PROGRAM_ID;
  authorities;
  globalFilter$: Observable<GlobalFilter>;
  programInfo$: Observable<Program>;
  attributes$: Observable<any[]>;
  completenessNotification$: Observable<any>;
  actionType: string;
  hasDistributionPointViewRendered: boolean;
  isDistributionPointViewVisible: boolean;
  userRoles: any;

  // Emiiter for events trigger
  @Output() addOrgUnit = new EventEmitter();
  @Output() addOrUpdateDitributionPoint = new EventEmitter();
  @Output() completenessNotification = new EventEmitter();
  @Output() deleteDitributionPoint = new EventEmitter();
  @Output() cancelDitributionPoint = new EventEmitter();

  constructor(private http: HttpClientService, private store: Store<AppState>, private userService: UserService) {
    this.globalFilter$ = store.select(getCurrentGlobalFilter);
    this.programInfo$ = store.select(getCurrentProgram(this.programId));
    this.attributes$ = store.select(getAttributes);
    this.completenessNotification$ = store.select(getCompletenessNotification);
    this.isDistributionPointViewVisible = true;
    this.hasDistributionPointViewRendered = false;
  }

  ngOnInit() {
    this.completenessNotification$.subscribe(notification => this.completenessNotification.emit(notification));
    this.loading = true;
    this.isDistributionPointViewVisible = true;
    this.hasDistributionPointViewRendered = false;
    setTimeout(() => {
      this.setDistributionPointView();
    }, 500);
    this.globalFilter$.subscribe(filters => {
      if (filters) {
        const { ou, pe } = filters;
        const period = pe.id;
        const month = period.substr(period.length - 2);
        const year = period.substr(0, 4);
        const lastDayOfMonth = new Date(Number(year), Number(month), 0).getDate();
        if (this.id !== 'new') {
          const payload = {
            programId: PROGRAM_ID,
            orgUnitId: this.id,
            startDate: `${year}-${month}-01`,
            endDate: `${year}-${month}-${lastDayOfMonth}`,
            period
          };
          this.store.dispatch(new eventsActions.LoadEventAction(payload));
        }

        this.ou = ou;
        this.pe = pe;
      }
    });
  }

  setDistributionPointView() {
    this.store.dispatch(new ResetMessageObjectOnOrganisationUnitAction());
    this.userService.getAuthorities().subscribe((authorities: any) => {
      this.authorities = authorities;
      if (this.id === 'new' && (authorities.indexOf('ALL') || authorities.indexOf('F_DATAVALUE_ADD'))) {
        // adding action for adding new water point
        this.actionType = 'add';
      } else {
        // Loading current selected organisation and set action of view
        this.store.dispatch(new LoadingOrganisationUnitAction(this.id));
        this.actionType = 'view';
      }
      this.loading = false;
    });
  }

  // on rendering view for static information of distribution point
  onViewDistributionRendered(event) {
    this.hasDistributionPointViewRendered = true;
    // { data : true/false}
  }
  // @todo conroll hide and show distribution point view
  cancelEditDistributionPoint(event) {
    // this.isDistributionPointViewVisible = false;
    this.cancelDitributionPoint.emit(event);
  }

  // On add or update  {isNew, distributionPoint}
  onAddOrUpdateDitributionPoint(event) {
    // On add or update  {isNew, distributionPoint}
    const { isNew, distributionPoint } = event;

    console.log({ event });

    const payload = {
      isNew,
      entityKey: `${distributionPoint.id}-${this.pe.id}`,
      payload: distributionPoint,
      programID: PROGRAM_ID
    };
    this.store.dispatch(new eventsActions.UpdateEventDataElementAction(payload));
    this.addOrUpdateDitributionPoint.emit(event);
  }

  onDeleteDistributionPoint(distributionPoint) {
    this.deleteDitributionPoint.emit(distributionPoint);
  }
}
