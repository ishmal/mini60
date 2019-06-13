import { TestBed } from '@angular/core/testing';

import { BtService } from './bt.service';

describe('BtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BtService = TestBed.get(BtService);
    expect(service).toBeTruthy();
  });
});
