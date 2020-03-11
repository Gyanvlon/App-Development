import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, LoadingOrganisationUnitAction } from '../../../../store';
import { Observable } from 'rxjs/Observable';
import {
  OrganisationUnitModel,
  AttributeValuesModel
} from '../../../../core/models/statict-data-entry.model';
import {
  getCurrentOrganisationUnit,
  getOrganisationUnitError,
  getOrganisationUnitLoading,
  getOrganisationUnitMessageObject
} from '../../../../store/selectors/organisation-unit.selectors';
import * as _ from 'lodash';

@Component({
  selector: 'app-statict-data-entry',
  templateUrl: './statict-data-entry.component.html',
  styleUrls: ['./statict-data-entry.component.css']
})
export class StatictDataEntryComponent implements OnInit {
  @Input() organisationUnitId: string;
  @Input() actionType: string;
  @Input() authorities: Array<string>;
  @Input() parentId: string;

  @Output() cancelEditForm = new EventEmitter();
  @Output() hasViewRendered = new EventEmitter();
  @Output() addOrUpdateDitributionPoint = new EventEmitter();
  @Output() deleteDitributionPoint = new EventEmitter();

  currentOrganisation$: Observable<OrganisationUnitModel>;
  isEditAllowed: boolean;
  isLoading$: Observable<boolean>;
  messageObject$: Observable<{
    message: string;
    status: string;
    statusText: string;
  }>;
  hasErrorOccurred$: Observable<boolean>;

  @Input()
  attributes: Array<AttributeValuesModel>;
  defaultOrganisationUnit: OrganisationUnitModel;

  constructor(private store: Store<AppState>) {
    this.isLoading$ = store.select(getOrganisationUnitLoading);
    this.messageObject$ = store.select(getOrganisationUnitMessageObject);
    this.hasErrorOccurred$ = store.select(getOrganisationUnitError);
    this.isEditAllowed = false;
  }

  ngOnInit() {
    debugger
    if (
      this.authorities &&
      (this.authorities.indexOf('ALL') > -1 ||
        this.authorities.indexOf('F_ORGANISATIONUNIT_ADD') > -1)
    ) {
      this.isEditAllowed = true;
    }
    if (this.organisationUnitId) {
      this.currentOrganisation$ = this.store.select(
        getCurrentOrganisationUnit(this.organisationUnitId)
      );
    }

    this.defaultOrganisationUnit = this.getDefaultOrganisationUnit();
    if (this.parentId) {
      this.defaultOrganisationUnit.parent.id = this.parentId;
    }
  }

  onViewDistributionRendered(event) {
    debugger
    this.hasViewRendered.emit(event);
  }

  onAddOrUpdateDitributionPoint(event) {
    debugger
    this.addOrUpdateDitributionPoint.emit(event);
  }

  onDeleteDistributionPoint(distributionPoint) {
    debugger
    this.deleteDitributionPoint.emit(distributionPoint);
  }

  cancelEditDistributionPoint(event) {
    this.cancelEditForm.emit(event);
  }
  getDefaultOrganisationUnit() {
    debugger
    const date = new Date();
    return {
      id: 'new',
      name: '',
      openingDate: new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1
      ).toISOString(),
      coordinates: ['-6.3690', '34.8888'],
      code: '',
      attributeValues: [],
      parent: {
        id: ''
      }
    };
  }
}
