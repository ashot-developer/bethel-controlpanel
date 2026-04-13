import { TestBed } from '@angular/core/testing';

import { YouthFacade } from './youth.facade';

describe('YouthFacade', () => {
  let service: YouthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YouthFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
