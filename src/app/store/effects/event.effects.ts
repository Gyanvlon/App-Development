import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/withLatestFrom';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { EventService } from '../../core/services/event.service';
import { AppState } from '../../store';
import {
  CreateEventAction,
  CreateEventSuccessAction,
  EventActionTypes,
  LoadEventAction,
  LoadEventFailAction,
  LoadEventSuccessAction,
  UpdateEventAction,
  UpdateEventDataElementSuccessAction,
  UpdateEventFailAction,
  UpdateEventSuccessAction
} from '../actions/event.actions';

@Injectable()
export class EventEffects {
  constructor(private actions$: Actions, private eventService: EventService, private store$: Store<AppState>) {}

  @Effect()
  loadOrgUnitEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.LOAD),
    map((action: LoadEventAction) => action.payload),
    switchMap(({ orgUnitId, startDate, endDate, programId, period }) => {
      return this.eventService.loadEvent(programId, orgUnitId, startDate, endDate).pipe(
        map(response => {
          const events = response['events'];
          const [firstEvent, ...restOfEvents] = events.sort((a, b) => Date.parse(a.created) - Date.parse(b.created));
          const eventEntity = {
            [`${orgUnitId}-${period}`]: firstEvent || null
          };
          return new LoadEventSuccessAction({
            eventEntity,
            restOfEvents: restOfEvents
          });
        }),
        catchError(error => of(new LoadEventFailAction(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  deleteMultipleEvent$ = this.actions$.pipe(
    ofType(EventActionTypes.LOAD_SUCCESS),
    map((action: LoadEventSuccessAction) => action.payload),
    map(({ restOfEvents }) => {
      const deleteObservable = restOfEvents.length
        ? restOfEvents.map(({ event }) => this.eventService.deleteEvent(event))
        : [of(null)];
      forkJoin(deleteObservable).subscribe(results => {});
    })
  );

  @Effect()
  updateEventDataElementValues$ = this.actions$.pipe(
    ofType(EventActionTypes.UPDATE_EVENT_ATTRIBUTES),
    withLatestFrom(this.store$.select(state => state.events.entities)),
    withLatestFrom(this.store$.select(state => state.programs.entities)),
    switchMap(actionAndStoreState => {
      const action = actionAndStoreState[0][0];
      const eventsEntities = actionAndStoreState[0][1];
      const programEntities = actionAndStoreState[1];
      const { entityKey, payload, programID }: any = action['payload'];
      const event = eventsEntities[entityKey];
      const { programStages } = programEntities[programID];
      const programStageDataElements = programStages.reduce(
        (accumulator, currentValue) => accumulator.concat(currentValue.programStageDataElements),
        []
      );
      const dataElements = programStageDataElements.reduce((accumulator, currentValue) => {
        const { compulsory, dataElement } = currentValue;
        const { id, code } = dataElement;
        if (code) {
          const obj = { [code]: id };
          accumulator = { ...accumulator, ...obj };
        }
        return accumulator;
      }, {});

      const { attributeValues, coordinates, name }: any = payload;
      const attributeDataValues = attributeValues.reduce((acc, attributeValue) => {
        const { attribute, value } = attributeValue;
        const dataElementId = dataElements[attribute.id];
        if (dataElementId && value !== '') {
          acc[dataElementId] = value;
        }
        return acc;
      }, {});

      const _dataValueAttributes = Object.keys(attributeDataValues).map(key => ({
        dataElement: key,
        value: attributeDataValues[key]
      }));
      let newEvent;
      let isNewEvent = true;
      let eventID;
      if (event) {
        const { dataValues } = event;
        eventID = event.event;
        const oldValues = dataValues.filter(
          ({ dataElement }) => ![...Object.keys(attributeDataValues)].includes(dataElement)
        );
        const newDataValues = [...oldValues, ..._dataValueAttributes];
        newEvent = {
          ...event,
          coordinate: {
            latitude: JSON.parse(coordinates)[0],
            longitude: JSON.parse(coordinates)[1]
          },
          dataValues: newDataValues
        };
        isNewEvent = false;
      } else {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const todayDate = today.getDate();
        newEvent = {
          program: programID,
          orgUnit: payload.id,
          eventDate: `${year}-${month}-${todayDate}`,
          status: 'ACTIVE',
          coordinate: {
            latitude: JSON.parse(coordinates)[0],
            longitude: JSON.parse(coordinates)[1]
          },
          dataValues: [..._dataValueAttributes]
        };
      }
      return this.eventService.createOrUpdateEVentFromAttributes(isNewEvent, newEvent, eventID).pipe(
        map(responses => {
          const { status, httpStatusCode, response } = responses;
          const eventid =
            response &&
            response.importSummaries &&
            response.importSummaries[0] &&
            response.importSummaries[0].reference;
          const entity = { [entityKey]: { ...newEvent, id: eventID || eventid } };
          const message = 'Event Saved Successfully';
          return new UpdateEventDataElementSuccessAction({
            message: { statusText: status, status: httpStatusCode, message },
            entity
          });
        }),
        catchError(error => of(new UpdateEventFailAction(error)))
      );
    })
  );

  @Effect()
  updateEventValues$ = this.actions$.pipe(
    ofType(EventActionTypes.UPDATE_EVENT),
    map((action: UpdateEventAction) => action.payload),
    switchMap(({ eventID, payload, orgUnit, periodId, id }) => {
      return this.eventService.updateEvent(eventID || payload.id, payload).pipe(
        map(response => {
          const entityKey = `${orgUnit}-${periodId}`;
          const entity = { [entityKey]: payload };
          const { status, httpStatusCode } = response;
          const message = 'Event(dynamic data) Saved Successfully';
          return new UpdateEventSuccessAction({
            message: { statusText: status, status: httpStatusCode, message },
            entity
          });
        }),
        catchError(error => of(new LoadEventFailAction(error)))
      );
    })
  );

  @Effect()
  createEventValues$ = this.actions$.pipe(
    ofType(EventActionTypes.CREATE_EVENT),
    map((action: CreateEventAction) => action.payload),
    switchMap(({ payload }) => {
      return this.eventService.createEvent(payload).pipe(
        map(response => {
          return new CreateEventSuccessAction({ response });
        }),
        catchError(error => of(new LoadEventFailAction(error)))
      );
    })
  );
}
