import { TestBed } from '@angular/core/testing';

import { ConvertTimeService } from './convert-time.service';

describe('ConvertTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConvertTimeService = TestBed.get(ConvertTimeService);
    expect(service).toBeTruthy();
  });
});
