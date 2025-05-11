import { TestBed } from '@angular/core/testing';

import { AccommodationManagingService } from './accommodation-managing.service';

describe('AccommodationManagingService', () => {
  let service: AccommodationManagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccommodationManagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
