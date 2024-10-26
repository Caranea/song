import { TestBed } from '@angular/core/testing';

import { V3ApiService } from './v3-api.service';

describe('V3ApiService', () => {
  let service: V3ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(V3ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
