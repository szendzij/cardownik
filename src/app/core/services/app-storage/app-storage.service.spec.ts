/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppStorageService } from './app-storage.service';

describe('Service: AppStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStorageService]
    });
  });

  it('should ...', inject([AppStorageService], (service: AppStorageService) => {
    expect(service).toBeTruthy();
  }));
});
