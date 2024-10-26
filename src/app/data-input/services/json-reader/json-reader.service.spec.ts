import { TestBed } from '@angular/core/testing';

import { JsonHandlerService } from './json-reader.service';

describe('JsonHandlerService', () => {
  let service: JsonHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
