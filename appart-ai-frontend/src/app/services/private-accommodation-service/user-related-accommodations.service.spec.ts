import { TestBed } from '@angular/core/testing';

import { UserRelatedAccommodationsService } from './user-related-accommodations.service';

describe('UserRelatedAccommodationsService', () => {
  let service: UserRelatedAccommodationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRelatedAccommodationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
