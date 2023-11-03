import { Component, OnInit } from '@angular/core';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';
import {
  BarcodeFormat,
  BarcodeScanner
} from '@capacitor-mlkit/barcode-scanning';
import { FormGroup, FormControl } from '@angular/forms';
import { DialogService } from './../core/services/dialog/dialog.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  public darkMode: boolean = true;
  public isSupportedDevice: boolean = false;
  public isPermissionGranted: boolean = false;
  private barcodeFormatValues: string[] = [];
  public googleLensInstallState: boolean = false
  public readonly barcodeFormat = BarcodeFormat;



  public formGroup = new FormGroup({
    formats: new FormControl(),
  });

  constructor(
    private appStorageService: AppStorageService,
    private dialogService: DialogService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.appStorageService.get('darkModeActivated');
    this.barcodeFormatValues = await this.appStorageService.get('barcodeFormats');
    this.formGroup.patchValue({ formats: this.barcodeFormatValues })
    this.isSupportedDevice = await this.appStorageService.get('supportedDevice')
    this.isPermissionGranted = await this.appStorageService.get('permissionGranted');

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
    await BarcodeScanner.installGoogleBarcodeScannerModule()
      .then(r => r)
      .catch(error => {
        console.log(error);
        this.googleLensInstallState = true;
        this.dialogService.showAlert({
          header: "Google Lens",
          message: 'Moduł - google lens już zainstalowano',
          buttons: ['OK']
        })
      });
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
      if (r.camera === "granted") {
        this.isPermissionGranted = true;
        return "granted"
      } else {
        return "denied"
      }
    });
  }


}
