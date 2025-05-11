import { TestBed } from '@angular/core/testing';

import { AccommodationStateService } from './accommodation-state.service';

describe('AccommodationStateService', () => {
  let service: AccommodationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccommodationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
