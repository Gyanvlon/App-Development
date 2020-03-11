import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { catchError, tap, mergeMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class AttributesService {
  dataEntryConfig: any;
  constructor(private httpClient: HttpClientService) {}

  loadDataEntryConfig() {
    return this.dataEntryConfig
      ? of(this.dataEntryConfig)
      : this.httpClient
          .get('dataStore/distribution-point-config/data-entry-config')
          .pipe(
            catchError(() => of(null)),
            tap((dataEntryConfig: any) => {
              this.dataEntryConfig = dataEntryConfig;
            })
          );
  }

  loadingAttributes(): Observable<any> {
    let url = 'attributes.json?paging=false';
    url +=
      '&fields=id,name,valueType,mandatory,optionSet[options[id,name,code]]&filter=organisationUnitAttribute:eq:true';
    return this.httpClient.get(url).pipe(
      mergeMap((response: any) =>
        this.loadDataEntryConfig().pipe(
          map((dataEntryConfig: any) => {
            const attributesFromDataStore = dataEntryConfig
              ? dataEntryConfig.attributes
              : [];

            return _.map(
              response ? response.attributes : [],
              (attribute: any) => {
                const correspondingAttribute = _.find(attributesFromDataStore, [
                  'id',
                  attribute.id
                ]);

                return correspondingAttribute
                  ? { ...attribute, ...correspondingAttribute }
                  : attribute;
              }
            );
          })
        )
      )
    );
  }
}
