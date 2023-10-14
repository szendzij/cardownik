import { Component, OnInit } from '@angular/core';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';
import { BarcodeFormat, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { FormControl, FormGroup } from '@angular/forms';

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


  public settingForm = new FormGroup({
    formats: new FormControl([]),
    lensFacing: new FormControl(LensFacing.Back),
  });

  constructor(private appStorageService: AppStorageService) { }

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.appStorageService.get('darkModeActivated');
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
  }

  public toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      this.appStorageService.set('darkModeActivated', true);
    } else {
      this.appStorageService.set('darkModeActivated', false);
    }
  }

  public async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  public async requestPermissions(): Promise<void> {
    await BarcodeScanner.requestPermissions();
  }


}
