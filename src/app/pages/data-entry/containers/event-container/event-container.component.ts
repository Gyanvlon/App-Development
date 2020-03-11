import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { AppState } from '../../../../store';
import { Observable } from 'rxjs/Observable';
import * as eventsActions from '../../../../store/actions/event.actions';
import {
  getCurrentEvent,
  getEventMessageObject,
  getEventLoading,
  getIsEventfromNewDistributionPoint,
  getIsEventError,
  getEventIsSubmitting
} from '../../../../store/selectors/event.selector';
import { getCurrentUser } from '../../../../store/selectors/current-user.selectors';
import { getAllAttributesObject } from '../../../../store/selectors/attributes.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-event-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-container.component.html',
  styleUrls: ['./event-container.component.css']
})
export class EventContainerComponent implements OnInit {
  @Input() programInfo;
  @Input() globalFilters;
  @Input() waterpointId;
  public dataElements;
  public periodId;
  public currentEvent$: Observable<any>;
  public currentAttributes$: Observable<any>;
  public hasCurrentEventErrored$: Observable<boolean>;
  public isEventLoading$: Observable<boolean>;
  public isEventSubmitting$: Observable<boolean>;
  public isNewDistributionPointCreated$: Observable<boolean>;
  public currentUser$: Observable<any>;
  public eventMessageObject$: Observable<any>;
  constructor(private store: Store<AppState>) {
    this.currentAttributes$ = this.store.select(getAllAttributesObject);
    this.hasCurrentEventErrored$ = this.store.select(getIsEventError);
    this.eventMessageObject$ = this.store.select(getEventMessageObject);
    this.isNewDistributionPointCreated$ = this.store.select(getIsEventfromNewDistributionPoint);
    this.isEventLoading$ = this.store.select(getEventLoading);
    this.isEventSubmitting$ = this.store.select(getEventIsSubmitting);
    this.currentUser$ = this.store.select(getCurrentUser);
  }

  ngOnInit() {
    if (this.programInfo) {
      this.transformDataElement(this.programInfo);
    }

    if (this.globalFilters && this.waterpointId) {
      const { pe, ou } = this.globalFilters;
      this.periodId = pe.id;
      this.currentEvent$ = this.store.select(getCurrentEvent(`${this.waterpointId}-${pe.id}`));
    }
  }

  transformDataElement({ programStages }) {
    const programStageDataElements = programStages.reduce(
      (accumulator, currentValue) => accumulator.concat(currentValue.programStageDataElements),
      []
    );
    this.dataElements = programStageDataElements.reduce((accumulator, currentValue) => {
      const obj = this.transformDataObject(currentValue);
      accumulator = { ...accumulator, ...obj };
      return accumulator;
    }, {});
  }

  transformDataObject(programStageDataElement) {
    let dataObject = {};
    const { compulsory, dataElement } = programStageDataElement;
    const { id, name, code, optionSet, valueType } = dataElement;
    const show = true;
    const type = optionSet ? 'select' : valueType;
    dataObject = { label: name, type, show, code };
    let validation = {};
    if (compulsory) {
      const required = true;
      validation = { ...validation, required };
    }
    if (type === 'INTEGER_ZERO_OR_POSITIVE') {
      const min = 0;
      validation = { ...validation, min };
    }
    if (type === 'INTEGER_POSITIVE') {
      const min = 1;
      validation = { ...validation, min };
    }
    dataObject = { ...dataObject, validation };
    if (optionSet) {
      const { options } = optionSet;
      const _options = options.map(option => ({
        label: option.name,
        value: option.code
      }));
      dataObject = { ...dataObject, options: _options };
    }
    return { [id]: dataObject };
  }
}
