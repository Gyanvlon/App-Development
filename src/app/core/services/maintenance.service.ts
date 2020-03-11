import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';

@Injectable()
export class MaintenanceService {
  constructor(private httpClient: HttpClientService) {}

  clearSystemCache(): Observable<any> {
    return this.httpClient.post('maintenance/cacheClear', {});
  }
}
