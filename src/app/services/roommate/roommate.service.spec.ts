import { TestBed } from '@angular/core/testing';

import { RoommateService } from './roommate.service';

describe('RoommateService', () => {
  let service: RoommateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoommateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
