import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientService } from './http-client.service';
import { Program } from '../models/program.model';

@Injectable()
export class ProgramService {
  constructor(private httpClient: HttpClientService) {}

  loadAll(): Observable<Program[]> {
    return this.httpClient.get(
      // tslint:disable-next-line
      `programs.json?fields=id,name,displayName,programRuleVariables[name,dataElement],programRules[condition,programRuleActions[dataElement,content,data,programRuleActionType]],programStages[id,programStageDataElements[compulsory,dataElement[id,name,code,valueType,optionSet[id,name,options[id,name,code]]]]&paging=false`
    );
  }
  loadProgram(programId: string): Observable<Program> {
    return this.httpClient.get(
      // tslint:disable-next-line
      `programs/${programId}.json?fields=id,name,displayName,programRuleVariables[name,dataElement],programRules[condition,programRuleActions[dataElement,content,data,programRuleActionType]],programStages[id,programStageDataElements[compulsory,dataElement[id,name,code,valueType,optionSet[id,name,options[id,name,code]]]]&paging=false`
    );
  }
}
