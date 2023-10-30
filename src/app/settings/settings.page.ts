import { Component, OnInit } from '@angular/core';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';
import {
  BarcodeFormat,
  BarcodeScanner,
  IsGoogleBarcodeScannerModuleAvailableResult,
  LensFacing
} from '@capacitor-mlkit/barcode-scanning';
import { FormGroup, FormControl } from '@angular/forms';
import {log} from "@capacitor/assets/dist/util/log";

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  public darkMode?: boolean;
  public isSupportedDevice = false;
  public isPermissionGranted = false;
  private barcodeFormatValues: string = "";
  public googleLensAvailable: any;
  public readonly barcodeFormat = BarcodeFormat;


  public formGroup = new FormGroup({
    formats: new FormControl(),
  });

  constructor(private appStorageService: AppStorageService) { }

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.appStorageService.get('darkModeActivated');
    this.barcodeFormatValues = await this.appStorageService.get('barcodeFormats');
    this.formGroup.patchValue({formats: this.barcodeFormatValues})

    this.isSupportedDevice = await this.appStorageService.get('supportedDevice')
    if(!this.isSupportedDevice) {
      BarcodeScanner.isSupported().then((result) => {
        this.isSupportedDevice = result.supported;
      });
    }

    this.isPermissionGranted = await this.appStorageService.get('permissionGranted')
    if(!this.isPermissionGranted) {
      BarcodeScanner.checkPermissions().then((result) => {
        this.isPermissionGranted = result.camera === 'granted';
      });
    }
    this.googleLensAvailable = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      this.appStorageService.set('darkModeActivated', true).then(r => r);
    } else {
      this.appStorageService.set('darkModeActivated', false).then(r => r);
    }
  }

  async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  saveBarcodeFormats(e:any) {
    this.appStorageService.set('barcodeFormats', e.detail.value).then(r => r);
  }

  async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }


}
