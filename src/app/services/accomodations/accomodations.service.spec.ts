import { TestBed } from '@angular/core/testing';

import { AccommodationsService } from './accomodations.service';

describe('AccomodationsService', () => {
  let service: AccommodationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccommodationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
