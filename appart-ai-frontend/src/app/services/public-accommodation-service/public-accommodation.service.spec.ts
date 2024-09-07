import { TestBed } from '@angular/core/testing';

import { PublicAccommodationService } from './public-accommodation.service';

describe('PublicAccommodationService', () => {
  let service: PublicAccommodationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicAccommodationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
