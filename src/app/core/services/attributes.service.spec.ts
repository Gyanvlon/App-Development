import { TestBed, inject } from '@angular/core/testing';

import { AttributesService } from './attributes.service';

describe('AttributesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttributesService]
    });
  });

  it('should be created', inject([AttributesService], (service: AttributesService) => {
    expect(service).toBeTruthy();
  }));
});
