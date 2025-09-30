import { TestBed } from '@angular/core/testing';

import { Nombre } from './nombre';

describe('Nombre', () => {
  let service: Nombre;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Nombre);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
