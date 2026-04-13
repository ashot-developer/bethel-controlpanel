import { TestBed } from '@angular/core/testing';

import { YouthService } from './youth.service';

describe('YouthService', () => {
  let service: YouthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YouthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
