import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { mergeMap, tap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import { GeoFeature } from '../models/geo-feature.model';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { IndexDbService } from '../../../../../core/services/index-db.service';
import { of } from 'rxjs/observable/of';
import { HttpClientService } from '../../../../../core/services/http-client.service';

@Injectable()
export class GeoFeatureService {
  constructor(private httpClient: HttpClientService, private indexDbService: IndexDbService) {
  }

  getGeoFeaturesArray(params) {
    const requests = params.map(param => {
      const url = `geoFeatures.json?${param}`;
      return this.httpClient.get(url);
    });

    return combineLatest(requests);
  }

  getGeoFeatures(param): Observable<GeoFeature[]> {

    const geoFeatureSchema = {name: 'geoFeatures', keyPath: 'id'};
    const url = `geoFeatures.json?${param}`;

    return this._getFromIndexDb(param).
      pipe(mergeMap((localGeoFeature: any) => localGeoFeature ? of(localGeoFeature) : this.httpClient.get(url).
        pipe(tap((geoFeature) => {
          this.indexDbService.post(
            geoFeatureSchema, {
              id: param,
              geoFeature: geoFeature
            }).subscribe(() => {
          });
        }))));
  }

  private _getFromIndexDb(param) {
    const geoFeatureSchema = {name: 'geoFeatures', keyPath: 'id'};
    return new Observable(observer => {
      this.indexDbService.get(geoFeatureSchema, param).subscribe((localGeoFeature: any) => {
        observer.next(localGeoFeature ? localGeoFeature.geoFeature : null);
        observer.complete();
      }, () => {
        observer.next(null);
        observer.complete();
      });
    });
  }
}
