import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientService } from './http-client.service';
import { DistributionPoint } from '../models/distribution-point.model';

@Injectable()
export class DistributionPointService {
  constructor(private httpClient: HttpClientService) {}

  delete(distributionPointId: string): Observable<DistributionPoint> {
    return this.httpClient.get(`sqlViews/fz8AT5Uz19Z/data.json?var=uid:${distributionPointId}`);
  }
}
