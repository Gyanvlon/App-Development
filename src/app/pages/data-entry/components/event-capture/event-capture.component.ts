import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as eventsActions from '../../../../store/actions/event.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import { interval } from 'rxjs/observable/interval';
import swal from 'sweetalert';
import { arrayify } from 'tslint/lib/utils';

const HIDE_FIELD = 'HIDEFIELD';
const SHOW_WARNING = 'SHOWWARNING';
const ASSIGN = 'ASSIGN';
const ERROR_ON_COMPLETE = 'ERRORONCOMPLETE';

@Component({
  selector: 'app-event-capture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-capture.component.html',
  styleUrls: ['./event-capture.component.css']
})
export class EventCaptureComponent implements OnChanges, OnInit {
  @Input() dataObject;
  @Input() currentEvent;
  @Input() currentAttributes;
  @Input() programInfo;
  @Input() isNewDistributionPointCreated;
  @Input() eventMessageObject;
  @Input() hasCurrentEventErrored;
  @Input() isEventLoading;
  @Input() periodId;
  @Input() currentUser;
  @Input() isEventSubmitting;
  isEventCompleted: boolean;
  hiddenFields: any;
  changedField: any;
  _eventMessageObject: any;
  dataValues;
  form: FormGroup;
  objectProps;
  filteredObjectProps;
  today;
  savingMessage: string;
  imgHeight: string;
  selectedField;
  selectionInputSettings = {
    valueField: 'value',
    textField: 'label',
    multipleSelection: false
  };
  errorInSubmiting = false;
  showErrorInline = true;
  constructor(private store: Store<AppState>) {
    this.today = new Date();
    this.hiddenFields = [];
    this.changedField = {};
  }

  ngOnChanges(changes: SimpleChanges) {
    this.imgHeight = '60px';
    this.savingMessage = 'Saving current Event(dynamic data)...';
    const { currentEvent, eventMessageObject } = changes;

    if (currentEvent) {
      this.currentEvent = currentEvent.currentValue;
      this.drawEventsForm();
    }
    if (eventMessageObject) {
      this._eventMessageObject = eventMessageObject.currentValue;
      interval(300)
        .take(1)
        .subscribe(() => {
          this._eventMessageObject = null;
        });
    }
  }

  ngOnInit() {
  
    this.drawEventsForm();
    this.selectedField = null;
  }

  customValueSelected(value, key) {
    this.changedField = { [key]: true };
    this.form.patchValue({ [key]: value });
  }

  getOptionValue(options = [], value): string {
    const optionObject = options.find((option: any) => option.value === value);
    return optionObject ? optionObject.label : '';
  }

  drawEventsForm() {
    if (this.currentEvent) {
      this.isEventCompleted = this.currentEvent.status === 'COMPLETED';
      const { dataValues } = this.currentEvent;
      this.dataValues = dataValues.reduce((acc, curr) => {
        const { dataElement, value } = curr;
        acc[dataElement] = value;
        return acc;
      }, {});
    }

    const objectProps = Object.keys(this.dataObject || {}).map(prop => {
      return Object.assign({}, { key: prop }, this.dataObject[prop]);
    });

    this.filteredObjectProps = objectProps.filter(
      ({ code }) =>
        !code ||
        (code && !Object.keys(this.currentAttributes) && !code.startsWith('SkipThisDE')) ||
        (code &&
          Object.keys(this.currentAttributes) &&
          !Object.keys(this.currentAttributes).includes(code) &&
          !code.startsWith('SkipThisDE'))
    );
    // setup the form
    this.createFormControls(this.filteredObjectProps);
    this.onFormChanges();
  }

  createFormControls(arayProps) {
    debugger;
    this.objectProps = arayProps;
    const formGroup = {};
    for (const objectProp of arayProps) {
      const { value, validation, code, key } = objectProp;
      const disabled = this.isEventCompleted || this.isNewDistributionPointCreated || this.hasCurrentEventErrored;
      formGroup[key] = new FormControl({ value: null, disabled }, this.mapValidators(validation));
    }
    this.form = new FormGroup(formGroup, { updateOn: 'blur' });
    const oldData = this.dataValues;
    if (this.dataValues) {
      debugger
      this.objectProps = arayProps.map(item => ({
        ...item,
        value: this.dataValues[item.key]
      }));
      this.skipLogicImplementation(this.dataValues);
      this.form.patchValue(this.dataValues);
      if (JSON.stringify(oldData) !== JSON.stringify(this.dataValues)) {
        this.updateEventOnChange(this.dataValues);
      }
    }
  }

  private mapValidators(validators) {
    debugger
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }

    return formValidators;
  }

  isFieldValid(field: string) {
    debugger
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    debugger;
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  showChangedFieldCss(field: string) {
    return {
      'has-changed': this.changedField[field]
    };
  }

  validateAllFormFields(formGroup: FormGroup) {
    debugger;
    (Object.keys(formGroup.controls) || []).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  changedInput(key) {
    this.changedField = { [key]: true };
  }

  onFormChanges(): void {
    debugger
    const eventResponse = this.currentEvent;
    this.form.valueChanges.subscribe(formData => {
      this.skipLogicImplementation({ ...this.dataValues, ...formData });
      this.updateEventOnChange({ ...this.dataValues, ...formData });
    });
  }

  updateEventOnChange(values) {
    debugger
    const dataValues = this.formatDataValuesFromForm({ ...values });
    const eventResponse = this.currentEvent;
    const { userCredentials } = this.currentUser;
    const payload = {
      ...eventResponse,
      dataValues,
      storedBy: userCredentials.username
    };
    const eventID = eventResponse.event;
    const orgUnit = eventResponse.orgUnit;
    return this.store.dispatch(
      new eventsActions.UpdateEventAction({
        eventID,
        payload,
        orgUnit,
        periodId: this.periodId
      })
    );
  }

  skipLogicImplementation(formData?, onComplete = false) {
    debugger
    const { programRuleVariables, programRules } = this.programInfo;

    let filteredPropsEntities = this.filteredObjectProps.reduce((entities, obj) => {
      entities[obj.key] = obj;
      return entities;
    }, {});

    for (const programRule of programRules) {
      const { condition, programRuleActions } = programRule;

      for (const action of programRuleActions) {
        const { programRuleActionType, dataElement, content, data } = action;
        const actiondataElementId = dataElement.id;
        let evalCondition = condition;
        let evalData;
        for (const ruleVariable of programRuleVariables) {
          const dataElementId = ruleVariable.dataElement && ruleVariable.dataElement.id;
          if (evalCondition.includes(ruleVariable.name)) {
            const variable = formData[dataElementId]
              ? isNaN(formData[dataElementId])
                ? `'${formData[dataElementId]}'`
                : `${formData[dataElementId]}`
              : 0;
            evalCondition = evalCondition.split('#{' + ruleVariable.name + '}').join(variable);
          }
          if ((data && data.includes(ruleVariable.name)) || (content && content.includes(ruleVariable.name))) {
            const dataArr = data.split('==');
            evalData = dataArr.length > 1 ? dataArr[1] : dataArr[0];
          }
        }

        if (evalCondition !== condition) {
          debugger
          try {
            // tslint:disable-next-line
            const evaluated = eval(`(${evalCondition})`);
            if (evaluated && programRuleActionType === HIDE_FIELD && !onComplete) {
              if (content) {
                const hideOutOptions = content
                  .replace('Options[', '')
                  .replace(']', '')
                  .split(',');
                const prop = filteredPropsEntities[actiondataElementId];
                if (prop) {
                  const entity = {
                    [actiondataElementId]: { ...prop, hideOutOptions }
                  };
                  filteredPropsEntities = {
                    ...filteredPropsEntities,
                    ...entity
                  };
                }
              } else {
                const show = false;
                const prop = filteredPropsEntities[actiondataElementId];
                if (prop) {
                  const entity = { [actiondataElementId]: { ...prop, show } };
                  filteredPropsEntities = {
                    ...filteredPropsEntities,
                    ...entity
                  };
                }
              }
            }
            if (evaluated && programRuleActionType === SHOW_WARNING && !onComplete) {
              const warning = content;
              const prop = filteredPropsEntities[actiondataElementId];
              if (prop) {
                const entity = { [actiondataElementId]: { ...prop, warning } };
                filteredPropsEntities = { ...filteredPropsEntities, ...entity };
              }
            }

            if (evaluated && programRuleActionType === ASSIGN && !onComplete) {
              const value = evalData.replace(/'/g, '');
              const disabled = true;
              formData[actiondataElementId] = value;
              const prop = filteredPropsEntities[actiondataElementId];
              if (prop) {
                const entity = {
                  [actiondataElementId]: { ...prop, value, disabled }
                };
                filteredPropsEntities = { ...filteredPropsEntities, ...entity };
                this.dataValues[actiondataElementId] = value;
              }
            }
            if (evaluated && programRuleActionType === ERROR_ON_COMPLETE && onComplete) {
              swal('Validation error!', content, 'error');
              this.errorInSubmiting = true;
            }
          } catch (error) {
          }
        }
      }
    }
    const filteredPropsArray = Object.keys(filteredPropsEntities).map(key => filteredPropsEntities[key]);
    this.objectProps = filteredPropsArray.filter(filteredPropsEntity => filteredPropsEntity.show);
    this.hiddenFields = filteredPropsArray
      .filter(filteredPropsEntity => !filteredPropsEntity.show)
      .map(({ key }) => key);
  }

  formatDataValuesFromForm(formData) {
    return Object.keys(formData).reduce((accumulator, dataElement) => {
      const value = formData[dataElement];
      const isHiddenDataElement = this.hiddenFields.includes(dataElement);
      if (value && !isHiddenDataElement) {
        accumulator = [...accumulator, { dataElement, value }];
      }
      return accumulator;
    }, []);
  }

  filterOptions(options: any[], hideOutOptions: string[]) {
    let unsortedOptions;
    if (hideOutOptions) {
      unsortedOptions = options.filter(option => !hideOutOptions.includes(option.value));
    } else {
      unsortedOptions = options;
    }
    return unsortedOptions.sort((a, b) => {
      const nameA = a.label.toLowerCase();
      const nameB = b.label.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

  }

  toggleComplete(formData) {
    this.skipLogicImplementation({ ...this.dataValues, ...formData }, true);
    if (this.errorInSubmiting && !this.isEventCompleted) {
      this.errorInSubmiting = false;
      return;
    }
    const eventResponse = this.currentEvent;
    const dataValues = this.formatDataValuesFromForm({ ...this.dataValues, ...formData });
    const status = this.isEventCompleted ? 'ACTIVE' : 'COMPLETED';
    let payload = {
      ...eventResponse,
      status,
      dataValues
    };
    const { userCredentials } = this.currentUser;
    if (!this.isEventCompleted) {
      payload = { ...payload, completedBy: userCredentials.username };
    }

    const eventID = eventResponse.event;
    const orgUnit = eventResponse.orgUnit;
    this.store.dispatch(
      new eventsActions.UpdateEventAction(
        {
          eventID,
          payload,
          orgUnit,
          periodId: this.periodId
        },
        true
      )
    );
    this.store.dispatch(
      new eventsActions.NotifyEventCompleteAction({
        completed: !this.isEventCompleted,
        orgUnit
      })
    );
  }
}
