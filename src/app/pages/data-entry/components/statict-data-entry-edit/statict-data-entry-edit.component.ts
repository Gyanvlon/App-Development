import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

import { MaintenanceService, OrganisationUnitService } from '../../../../core';
import {
  AttributeValuesModel,
  OrganisationUnitModel
} from '../../../../core/models/statict-data-entry.model';
import {
  AppState,
  ResetMessageObjectOnOrganisationUnitAction,
  SuccessToOrganisationUnitAction,
  UpdateMessageObjectOnOrganisationUnitAction
} from '../../../../store';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'app-statict-data-entry-edit',
  templateUrl: './statict-data-entry-edit.component.html',
  styleUrls: ['./statict-data-entry-edit.component.css']
})
export class StatictDataEntryEditComponent implements OnInit {
  @Input() organisationUnit: OrganisationUnitModel;
  @Input() attributes: Array<AttributeValuesModel>;
  organisationUnitObject: OrganisationUnitModel;
  organisationUnitObjectBackup: OrganisationUnitModel;
  @Output() cancelEditForm = new EventEmitter();
  @Output() addOrUpdateDitributionPoint = new EventEmitter();
  isEditable: boolean;
  isSaving: boolean;
  isSavingActionTriggered: boolean;
  isCodeGenerationActive: boolean;
  isCreationOfDistributtionFailed: boolean;
  isUniqueCodeMissing: boolean;
  constructor(
    private store: Store<AppState>,
    private organisationUnitService: OrganisationUnitService,
    private userService: UserService,
    private maintenanceService: MaintenanceService
  ) {
    this.isEditable = true;
    this.isSaving = false;
    this.isSavingActionTriggered = false;
    this.isCodeGenerationActive = false;
    this.isCreationOfDistributtionFailed = false;
    this.isUniqueCodeMissing = false;
  }
  ngOnInit() {
    this.organisationUnitObject = this.getOganisationUnitObject();
    this.organisationUnitObjectBackup = this.getOganisationUnitObject();
  }

  getOganisationUnitObject() {
    const organisationUnitObject = Object.assign({}, this.organisationUnit);
    delete organisationUnitObject.attributeValues;
    const { attributeValues } = this.organisationUnit;
    const newAttributeValues = [];
    const attributes = _.cloneDeep(this.attributes);
    attributes.map((attributeObject: AttributeValuesModel) => {
      const matchAttributes: AttributeValuesModel = _.find(
        attributeValues,
        (attributeValue: AttributeValuesModel) => {
          return attributeValue.attribute.id === attributeObject.attribute.id;
        }
      );
      if (matchAttributes) {
        attributeObject.value = matchAttributes.value;
      }
      newAttributeValues.push(attributeObject);
    });

    organisationUnitObject['attributeValues'] = newAttributeValues;
    return organisationUnitObject;
  }

  onCoordinateChange(event) {
    this.organisationUnitObject.coordinates = event;
  }

  isAllAttributesMandoryFieldFilled(
    attributeValues: Array<AttributeValuesModel>
  ) {
    let result = true;
    attributeValues.map((attributeValue: AttributeValuesModel) => {
      if (attributeValue.attribute.mandatory && attributeValue.value === '') {
        result = false;
      }
    });
    return result;
  }

  generateCodeForDistributionpoint() {
    this.store.dispatch(new ResetMessageObjectOnOrganisationUnitAction());
    this.isCreationOfDistributtionFailed = false;
    this.organisationUnitObject.code = '';
    this.isCodeGenerationActive = true;
    const { parent } = this.organisationUnitObject;
    this.organisationUnitService.loadingOrganisationUnit(parent.id).subscribe(
      (organisationUnit: OrganisationUnitModel) => {
        const { code } = organisationUnit;
        const { children } = organisationUnit;
        if (code) {
          this.organisationUnitService
            .getSearchMatchedOrganisationUnitCodes(code)
            .subscribe(
              (response: any) => {
                const { organisationUnits } = response;
                if (organisationUnits) {
                  const availableCodes = _.map(
                    organisationUnits,
                    (organisationUnitObj: any) => {
                      return organisationUnitObj.code;
                    }
                  );
                  if (availableCodes.length < 100) {
                    const generatedCode = this.organisationUnitService.getUniqueOrganisationUnitCode(
                      code,
                      availableCodes
                    );
                    this.organisationUnitObject.code = generatedCode;
                    this.isCodeGenerationActive = false;
                    this.isUniqueCodeMissing = false;
                  } else {
                    this.isCodeGenerationActive = false;
                    const type = 'danger';
                    const message = {
                      httpStatus: 'Conflict',
                      httpStatusCode: 409,
                      message:
                        'Maximum number of distribution points has been reached'
                    };
                    this.store.dispatch(
                      new UpdateMessageObjectOnOrganisationUnitAction({
                        type: type,
                        message: message
                      })
                    );
                  }
                } else {
                  this.isCodeGenerationActive = false;
                  const type = 'danger';
                  const message = {
                    httpStatus: 'Conflict',
                    httpStatusCode: 409,
                    message: 'Error formatting on response from the server'
                  };
                  this.store.dispatch(
                    new UpdateMessageObjectOnOrganisationUnitAction({
                      type: type,
                      message: message
                    })
                  );
                }
              },
              error => {
                this.isCodeGenerationActive = false;
                const type = 'danger';
                const message = error;
                this.store.dispatch(
                  new UpdateMessageObjectOnOrganisationUnitAction({
                    type: type,
                    message: message
                  })
                );
              }
            );
        } else {
          this.isCodeGenerationActive = false;
          const type = 'danger';
          const message = {
            httpStatus: 'Conflict',
            httpStatusCode: 409,
            message:
              'Missing code on parent, please constact system administrator'
          };
          this.store.dispatch(
            new UpdateMessageObjectOnOrganisationUnitAction({
              type: type,
              message: message
            })
          );
        }
      },
      error => {
        this.isCodeGenerationActive = false;
        const type = 'danger';
        const message = error;
        this.store.dispatch(
          new UpdateMessageObjectOnOrganisationUnitAction({
            type: type,
            message: message
          })
        );
      }
    );
  }

  save() {
    this.store.dispatch(new ResetMessageObjectOnOrganisationUnitAction());
    this.isUniqueCodeMissing = false;
    if (this.organisationUnitObject.code === '') {
      this.isUniqueCodeMissing = true;
    } else {
      this.isSavingActionTriggered = true;
      this.isCreationOfDistributtionFailed = false;
      this.isSaving = true;
      const { attributeValues } = this.organisationUnitObject;
      const { parent } = this.organisationUnitObject;
      const { code } = this.organisationUnitObject;
      const { coordinates } = this.organisationUnitObject;
      const { id } = this.organisationUnitObject;
      const isAllAttributesMandoryFieldFilled = this.isAllAttributesMandoryFieldFilled(
        attributeValues
      );
      if (
        this.organisationUnitObject.name === '' ||
        !isAllAttributesMandoryFieldFilled
      ) {
        this.isSaving = false;
      } else {
        let attributesString = '';
        attributeValues.map((attribute, index) => {
          if (index > 0) {
            attributesString += '-_';
          }
          let value = attribute.value;
          if (value) {
            try {
              value = value
                .toString()
                .split('/')
                .join('-_slash_-');
            } catch (e) {
              console.log(e);
            }
          }
          attributesString += attribute.attribute.id + '_-' + value;
        });
        const name = this.organisationUnitObject.name
          .split(',')
          .join('-_comma_-')
          .split('/')
          .join('-_slash_-')
          .split('.')
          .join('-_dot_-')
          .split("'")
          .join('-_apost_-')
          .split('(')
          .join('-_bopen_-')
          .split(')')
          .join('-_bclose_-');
        this.userService.getUser().subscribe(
          (user: any) => {
            this.organisationUnitService
              .addOrUpdateOranisationUnit(
                name,
                user.id,
                attributesString,
                id,
                parent.id,
                code,
                coordinates
              )
              .subscribe(
                (response: any) => {
                  const { rows } = response;
                  const organisationUnitId = rows[0][0];
                  if (organisationUnitId.length !== 11) {
                    this.isSavingActionTriggered = false;
                    this.isCreationOfDistributtionFailed = id === 'new';
                    this.isSaving = false;
                    const type = 'danger';
                    const message = {
                      httpStatus: 'Conflict',
                      httpStatusCode: 409,
                      message: rows[0][0]
                    };
                    this.store.dispatch(
                      new UpdateMessageObjectOnOrganisationUnitAction({
                        type: type,
                        message: message
                      })
                    );
                  } else {
                    const isNew =
                      this.organisationUnitObject.id !== organisationUnitId;
                    this.organisationUnitObject.id = organisationUnitId;
                    this.addOrUpdateDitributionPoint.emit({
                      isNew: isNew,
                      distributionPoint: this.organisationUnitObject
                    });
                    this.store.dispatch(
                      new SuccessToOrganisationUnitAction(
                        this.organisationUnitObject
                      )
                    );

                    let type = 'success';
                    let message = {
                      statusText: 'Ok',
                      status: 200,
                      message:
                        id === 'new'
                          ? this.organisationUnitObject.name +
                            ' has been added successfully'
                          : this.organisationUnitObject.name +
                            ' has been updated successfully'
                    };
                    this.store.dispatch(
                      new UpdateMessageObjectOnOrganisationUnitAction({
                        type: type,
                        message: message
                      })
                    );
                    this.isSavingActionTriggered = false;
                    this.isSaving = false;
                    this.maintenanceService.clearSystemCache().subscribe(
                      () => {
                        type = 'success';
                        message = {
                          statusText: 'Ok',
                          status: 200,
                          message: 'System cache has been cleared successfully'
                        };
                        this.store.dispatch(
                          new UpdateMessageObjectOnOrganisationUnitAction({
                            type: type,
                            message: message
                          })
                        );
                      },
                      error => {
                        type = 'danger';
                        this.store.dispatch(
                          new UpdateMessageObjectOnOrganisationUnitAction({
                            type: type,
                            message: error
                          })
                        );
                      }
                    );
                  }
                },
                error => {
                  this.isSavingActionTriggered = false;
                  this.isSaving = false;
                  const type = 'danger';
                  this.store.dispatch(
                    new UpdateMessageObjectOnOrganisationUnitAction({
                      type: type,
                      message: error
                    })
                  );
                }
              );
          },
          error => {
            this.isSavingActionTriggered = false;
            this.isSaving = false;
            const type = 'danger';
            this.store.dispatch(
              new UpdateMessageObjectOnOrganisationUnitAction({
                type: type,
                message: error
              })
            );
          }
        );
      }
    }
  }

  getAttributeValuesWithRuleActions(attributeObjectRules, attributeValue) {
    const attributeValuesWithRuleActions = _.flatten(
      _.map(attributeObjectRules || [], (rule: any) => {
        const operationResultArray =
          rule && rule.conditionSet
            ? rule.conditionSet.conditions.map(condition => {
                return eval(
                  `'${attributeValue.value}'` +
                    '' +
                    condition.operator +
                    '' +
                    condition.compareValue
                );
              })
            : [];
        const operationResult = eval(
          operationResultArray.join('' + rule.conditionSet.joinOperator + '')
        );
        return operationResult
          ? rule.actions
          : (rule.actions || []).map((ruleAction: any) => {
              return { attribute: ruleAction.attribute };
            });
      })
    );

    // Combine actions for same attributes
    const attributeValuesEntities = attributeValuesWithRuleActions.reduce(
      (attributeValueObject: any, attributeValuesWithRuleAction: any) => {
        attributeValueObject[attributeValuesWithRuleAction.attribute] = {
          ...(attributeValueObject[attributeValuesWithRuleAction.attribute] ||
            {}),
          ...attributeValuesWithRuleAction
        };

        return attributeValueObject;
      },
      {}
    );

    return _.filter(
      _.map(
        _.keys(attributeValuesEntities),
        (attributeValueKey: string) =>
          attributeValuesEntities[attributeValueKey]
      )
    );
  }

  onValueUpdate(attributeValue: any) {
    const attributeObject = attributeValue ? attributeValue.attribute : null;
    if (attributeObject) {
      const attributeValuesToUpdate = this.getAttributeValuesWithRuleActions(
        attributeObject.rules,
        attributeValue
      );

      if (attributeValuesToUpdate.length > 0) {
        this.organisationUnitObject = {
          ...this.organisationUnitObject,
          attributeValues: _.map(
            this.organisationUnitObject.attributeValues || [],
            (orgUnitAttributeValue: any) => {
              const orgUnitAttributeId =
                orgUnitAttributeValue && orgUnitAttributeValue.attribute
                  ? orgUnitAttributeValue.attribute.id
                  : '';

              const correspondingAttribute = _.find(attributeValuesToUpdate, [
                'attribute',
                orgUnitAttributeId
              ]);

              const newAttributeValue =
                attributeValue &&
                attributeValue.attribute &&
                attributeValue.attribute.id === orgUnitAttributeId
                  ? attributeValue.value
                  : orgUnitAttributeValue.value;

              return correspondingAttribute
                ? {
                    ...orgUnitAttributeValue,
                    value:
                      correspondingAttribute.action &&
                      correspondingAttribute.action.value
                        ? correspondingAttribute.action.value
                        : newAttributeValue,
                    attribute: {
                      ...orgUnitAttributeValue.attribute,
                      action: correspondingAttribute.action
                    }
                  }
                : {
                    ...orgUnitAttributeValue,
                    value: newAttributeValue
                  };
            }
          )
        };
      } else {
        this.organisationUnitObject = {
          ...this.organisationUnitObject,
          attributeValues: _.map(
            this.organisationUnitObject.attributeValues || [],
            (orgUnitAttributeValue: any) => {
              const orgUnitAttributeId =
                orgUnitAttributeValue && orgUnitAttributeValue.attribute
                  ? orgUnitAttributeValue.attribute.id
                  : '';

              const value =
                attributeValue &&
                attributeValue.attribute &&
                attributeValue.attribute.id === orgUnitAttributeId
                  ? attributeValue.value
                  : orgUnitAttributeValue.value;

              return {
                ...orgUnitAttributeValue,
                value
              };
            }
          )
        };
      }
    }
  }

  cancel() {
    const thereIsChangesOnForm = this.isThereChangesOnform();
    if (thereIsChangesOnForm) {
      if (
        confirm(
          'Are you sure you want to discard any changes on this distribution point'
        )
      ) {
        this.cancelEditForm.emit({ data: true });
      }
    } else {
      this.cancelEditForm.emit({ data: true });
    }
  }

  isThereChangesOnform() {
    let thereIsChangesOnForm = false;
    const keys = _.union(
      Object.keys(this.organisationUnitObject),
      Object.keys(this.organisationUnitObjectBackup)
    );
    keys.map(key => {
      if (
        _.isArray(this.organisationUnitObject[key]) &&
        this.organisationUnitObject[key].length > 0
      ) {
        if (key === 'attributeValues') {
          this.organisationUnitObject[key].map(data => {
            if (data && data.value && data.attribute && data.attribute.id) {
              const id = data.attribute.id;
              const value = data.value;
              const matchedData = _.find(
                this.organisationUnitObjectBackup[key],
                dataObject => {
                  return dataObject.attribute.id === id;
                }
              );
              if (
                matchedData &&
                matchedData.value &&
                value !== matchedData.value
              ) {
                thereIsChangesOnForm = true;
              }
            }
          });
        }
      } else if (
        this.organisationUnitObject[key] !==
        this.organisationUnitObjectBackup[key]
      ) {
        thereIsChangesOnForm = true;
      }
    });
    return thereIsChangesOnForm;
  }
}
