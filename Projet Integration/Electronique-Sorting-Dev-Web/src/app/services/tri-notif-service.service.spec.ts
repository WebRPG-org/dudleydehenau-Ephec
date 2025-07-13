import { TestBed } from '@angular/core/testing';

import { TriNotifServiceService } from './tri-notif-service.service';

describe('TriNotifServiceService', () => {
  let service: TriNotifServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriNotifServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
