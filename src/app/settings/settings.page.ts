import { Component, OnInit } from '@angular/core';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';
import { BarcodeFormat, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {

  public darkMode?: boolean;

  public isSupported = false;
  public isPermissionGranted = false;

  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;

  private barcodeFormatValues: string = "";
  private lensFacingValue: LensFacing | undefined;

  public formGroup = new FormGroup({
    formats: new FormControl(),
    lensFacing: new FormControl(LensFacing.Back),
  });

  constructor(private appStorageService: AppStorageService) { }

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.appStorageService.get('darkModeActivated');
    this.barcodeFormatValues = await this.appStorageService.get('barcodeFormats');
    this.lensFacingValue = await this.appStorageService.get('lensFacing');

    this.formGroup.patchValue({formats: this.barcodeFormatValues})
    this.formGroup.patchValue({lensFacing: this.lensFacingValue})

    console.log(this.formGroup.controls.formats.value)

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });

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

  saveBarcodeFormats(e:any) {
    this.appStorageService.set('barcodeFormats', e.detail.value).then(r => r);
  }

  saveLensFacing(e:any) {
    this.appStorageService.set('lensFacing', e.detail.value).then(r => r);
  }

  async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }


}
