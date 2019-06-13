import { TestBed } from '@angular/core/testing';

import { Mini60Service } from './mini60.service';

describe('Mini60Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Mini60Service = TestBed.get(Mini60Service);
    expect(service).toBeTruthy();
  });
});
