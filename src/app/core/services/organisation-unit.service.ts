import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { of } from 'rxjs';
import { map, tap, catchError, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class OrganisationUnitService {
  constructor(private httpClient: HttpClientService) {}

  loadingOrganisationUnit(organisationUnitId: string): Observable<any> {
    let apiUrl =
      'organisationUnits/' +
      organisationUnitId +
      '.json?fields=id,name,shortName,openingDate,code,parent,coordinates,attributeValues[value,attribute[id]],coordinates,parent[id],';
    apiUrl += 'children';
    return this.httpClient.get(apiUrl);
  }

  deleteOrganisationUnit(organisationUnitId: string): Observable<any> {
    const apiUrl =
      'sqlViews/fz8AT5Uz19Z/data.json?var=uid:' + organisationUnitId;
    return this.httpClient.get(apiUrl);
  }

  getSearchMatchedOrganisationUnitCodes(codePattern: string): Observable<any> {
    const apiUrl =
      'organisationUnits.json?paging=false&fields=id,code&filter=code:ilike:' +
      codePattern;
    return this.httpClient.get(apiUrl);
  }

  getUniqueOrganisationUnitCode(parentCode, availableCodes) {
    const count = 1;
    const pattern = parentCode + '0' + count;
    let uniqueOrganisationUnitCode = '';
    if (availableCodes.indexOf(pattern) > -1) {
      uniqueOrganisationUnitCode = this.getOrganisationUnitCodeRecursively(
        parentCode,
        availableCodes,
        count
      );
    } else {
      uniqueOrganisationUnitCode = pattern;
    }
    return uniqueOrganisationUnitCode;
  }

  getOrganisationUnitCodeRecursively(parentCode, availableCodes, count) {
    let uniqueOrganisationUnitCode = '';
    let pattern = parentCode;
    if (count < 9) {
      pattern += '0' + (count + 1);
    } else {
      pattern += count + 1;
    }
    if (availableCodes.indexOf(pattern) > -1) {
      count++;
      uniqueOrganisationUnitCode = this.getOrganisationUnitCodeRecursively(
        parentCode,
        availableCodes,
        count
      );
    } else {
      uniqueOrganisationUnitCode = pattern;
    }
    return uniqueOrganisationUnitCode;
  }

  addOrUpdateOranisationUnit(
    name: string,
    userId: string,
    attributesString: string,
    distributionPointId: string,
    parentId: string,
    code: string,
    coordinates: any
  ): Observable<any> {
    code = code.split('.').join('dot');
    coordinates = coordinates
      .split('.')
      .join('dot')
      .replace('[', '')
      .replace(']', '')
      .replace(',', 'comma');
    let apiUrl = 'sqlViews/FRUcnTzKfzm/data.json?var=name:' + name;
    apiUrl += '&var=parent:' + parentId + '&var=userid:' + userId;
    apiUrl += '&var=attributes:' + attributesString;
    apiUrl += '&var=waterpointid:' + distributionPointId;
    apiUrl += '&var=code:' + code + '&var=coordinates:' + coordinates;
    return this.httpClient.get(apiUrl);
  }

  loadOrganisationUnitPopulationData(orgUnitId: string, periodId: string) {
    const periodYear = parseInt((periodId || '').slice(0, 4), 10);
    const periodMonth = parseInt((periodId || '').slice(4), 10);

    if (isNaN(periodYear) || isNaN(periodMonth)) {
      return of(0);
    }

    const endPeriod = new Date(periodYear, periodMonth, 0);

    const startDate = `${periodYear}-${periodMonth}-1`;
    const endDate = `${endPeriod.getFullYear()}-${endPeriod.getMonth() +
      1}-${endPeriod.getDate()}`;

    return this.httpClient
      .get(
        `sqlViews/bKQbaD3L5Tb/data.json?var=organisationunit:${orgUnitId}&var=startdate:${startDate}&var=enddate:${endDate}`
      )
      .pipe(
        map((res: any) => {
          return res ? (res.rows ? (res.rows[0] ? res.rows[0][0] : 0) : []) : 0;
        }),
        catchError(() => of(0))
      );
  }
}
