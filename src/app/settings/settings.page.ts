import { Component, OnInit } from '@angular/core';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';
import {
  BarcodeFormat,
  BarcodeScanner
} from '@capacitor-mlkit/barcode-scanning';
import { FormGroup, FormControl } from '@angular/forms';
import { DialogService } from '../core';
import { LocalNotifications, ScheduleOptions } from "@capacitor/local-notifications";
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  public darkMode: boolean = true;
  public isSupportedDevice: boolean = false;
  public isCameraPermissionGranted: boolean = false;
  public isNotificationPermissionGranted: boolean = false;
  public isGeolocationPermissionGranted: boolean = false;
  private barcodeFormatValues: string[] = [];
  public googleLensInstallState: boolean = false
  public isGoogleLensAvailable: boolean = false
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
    this.isCameraPermissionGranted = await this.appStorageService.get('cameraPermission');
    this.isGeolocationPermissionGranted = await this.appStorageService.get('geolocationPermission');
    this.isNotificationPermissionGranted = await this.appStorageService.get('notificationPermission');
    this.isGoogleLensAvailable = await this.appStorageService.get('googleBarcodeScannerModuleAvailability');
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
    const result = await BarcodeScanner.installGoogleBarcodeScannerModule()
      .then(async result => {
        await this.dialogService.showLoading({
          message: 'Instalowanie Google Lens',
          duration: 2000
        })
        return result;
      })
      .catch(error => {
        console.error(error);
      });
    console.log(result)
    if (result === undefined) {
      this.googleLensInstallState = true;
    }
  }

  async isGoogleBarcodeScannerModuleAvailable() {
    const result = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return result.available;
  }

  saveBarcodeFormats(e: any) {
    this.appStorageService.set('barcodeFormats', e.detail.value).then(r => r);
  }

  async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  async requestPermissionsCamera(): Promise<void> {
    await BarcodeScanner.requestPermissions().then(r => {
      if (r.camera === "granted") {
        this.isCameraPermissionGranted = true;
        return "granted"
      } else {
        return "denied"
      }
    });
  }

  async requestPermissionsNotification(): Promise<void> {
    await LocalNotifications.requestPermissions().then(r => {
      if (r.display === "granted") {
        this.isNotificationPermissionGranted = true;
        return "granted"
      } else {
        return "denied"
      }
    });
  }

  async requestPermissionsLocalization(): Promise<void> {
    await Geolocation.requestPermissions().then(r => {
      if (r.location === "granted") {
        this.isGeolocationPermissionGranted = true;
        return "granted"
      } else {
        return "denied"
      }
    });
  }

  async scheduleNotification() {
    let options: ScheduleOptions = {
      notifications: [
        {
          id: 1,
          title: "Reminder Notification",
          body: "Explore new variety and offers",
          largeBody: "Get 30% discounts on new products",
          summaryText: "Exciting offers ! ! ! ",
        }
      ]
    }
    try {
      await LocalNotifications.schedule(options)
    } catch (ex) {
      alert(JSON.stringify(ex))
    }
  }


}
