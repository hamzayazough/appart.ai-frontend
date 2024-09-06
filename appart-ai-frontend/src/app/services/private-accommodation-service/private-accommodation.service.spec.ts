import { TestBed } from '@angular/core/testing';

import { PrivateAccommodationService } from './private-accommodation.service';

describe('PrivateAccommodationService', () => {
  let service: PrivateAccommodationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivateAccommodationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
