import { TestBed } from '@angular/core/testing';

import { ContractorAuthGuard } from './contractor-auth.guard';

describe('ContractorAuthGuard', () => {
  let guard: ContractorAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ContractorAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
