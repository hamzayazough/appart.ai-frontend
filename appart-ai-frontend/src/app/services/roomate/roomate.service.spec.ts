import { TestBed } from '@angular/core/testing';

import { RoomateService } from './roomate.service';

describe('RoomateService', () => {
  let service: RoomateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
