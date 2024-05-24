import { TestBed } from '@angular/core/testing';

import { BookingSharedService } from './booking-shared.service';

describe('BookingSharedService', () => {
  let service: BookingSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
