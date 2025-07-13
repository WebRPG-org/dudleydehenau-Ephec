import { TestBed } from '@angular/core/testing';

import { SupabaseAuthService } from './supabaseAuth.service';

describe('SupabaseAuthService', () => {
  let service: SupabaseAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
