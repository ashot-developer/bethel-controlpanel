import { TestBed } from '@angular/core/testing';

import { YouthState } from './youth.state';

describe('YouthState', () => {
  let service: YouthState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YouthState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
