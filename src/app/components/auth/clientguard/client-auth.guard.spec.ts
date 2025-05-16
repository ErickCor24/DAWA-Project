import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ClientAuthGuard } from './client-auth.guard';

describe('clientAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ClientAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
