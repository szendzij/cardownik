import { Injectable, OnInit } from '@angular/core';
import {
  BarcodeScanner,
} from '@capacitor-mlkit/barcode-scanning';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  public isSupported = false;
  public isPermissionGranted = false;

  constructor() { }

  public checkIsSupportedDevice() {
    return BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  public checkIfHasPermissionGranted() {
    return BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
  }
}
