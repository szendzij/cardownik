import {Component, NgZone, OnInit} from '@angular/core';
import {AppStorageService} from '../core/services/app-storage/app-storage.service';
import {
  BarcodeFormat,
  BarcodeScanner
} from '@capacitor-mlkit/barcode-scanning';
import {FormGroup, FormControl} from '@angular/forms';
import {GoogleBarcodeScannerModuleInstallProgressEvent} from "@capacitor-mlkit/barcode-scanning/dist/esm/definitions";

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  public darkMode?: boolean;
  public isSupportedDevice: boolean = false;
  public isPermissionGranted: boolean = false;
  private barcodeFormatValues: string[] = [];
  public googleLensAvailable: boolean = false
  public readonly barcodeFormat = BarcodeFormat;
  private readonly ngZone: NgZone;



  public formGroup = new FormGroup({
    formats: new FormControl(),
  });

  constructor(
    private appStorageService: AppStorageService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.appStorageService.get('darkModeActivated');
    this.barcodeFormatValues = await this.appStorageService.get('barcodeFormats');
    this.formGroup.patchValue({formats: this.barcodeFormatValues})
    this.isSupportedDevice = await this.appStorageService.get('supportedDevice')
    this.isPermissionGranted = await this.appStorageService.get('permissionGranted')
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

  async isGoogleBarcodeScannerModuleAvailable() {
    await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
  }

  saveBarcodeFormats(e: any) {
    this.appStorageService.set('barcodeFormats', e.detail.value).then(r => r);
  }

  async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions().then(r => {
      if(r.camera === "granted"){
        return "granted"
      } else {
        return "denied"
      }
    });
  }


}
