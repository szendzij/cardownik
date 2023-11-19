import { Component, OnInit } from "@angular/core";
import { AppStorageService } from "../core/services/app-storage/app-storage.service";
import {
  BarcodeFormat,
  BarcodeScanner,
} from "@capacitor-mlkit/barcode-scanning";
import { FormGroup, FormControl } from "@angular/forms";
import { DialogService } from "../core";
import {
  LocalNotifications,
  ScheduleOptions,
} from "@capacitor/local-notifications";
import { ClearWatchOptions, Geolocation } from "@capacitor/geolocation";

@Component({
  selector: "app-settings",
  templateUrl: "settings.page.html",
  styleUrls: ["settings.page.scss"],
})
export class SettingsPage implements OnInit {
  public darkMode: boolean = false;
  public localizationMonitoring: boolean = false;
  public isSupportedDevice: boolean = false;
  public isCameraPermissionGranted: boolean = false;
  public isNotificationPermissionGranted: boolean = false;
  public isGeolocationPermissionGranted: boolean = false;
  private barcodeFormatValues: string[] = [];
  public googleLensInstallState: boolean = false;
  public isGoogleLensAvailable: boolean = false;
  public readonly barcodeFormat = BarcodeFormat;
  public watchId: any;

  public formGroup = new FormGroup({
    formats: new FormControl(),
  });

  constructor(
    private appStorageService: AppStorageService,
    private dialogService: DialogService
  ) {}

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.appStorageService.get("darkModeActivated");
    this.barcodeFormatValues = await this.appStorageService.get(
      "barcodeFormats"
    );
    this.formGroup.patchValue({ formats: this.barcodeFormatValues });
    this.isSupportedDevice = await this.appStorageService.get(
      "supportedDevice"
    );
    this.isCameraPermissionGranted = await this.appStorageService.get(
      "cameraPermission"
    );
    this.isGeolocationPermissionGranted = await this.appStorageService.get(
      "geolocationPermission"
    );
    this.isNotificationPermissionGranted = await this.appStorageService.get(
      "notificationPermission"
    );
    this.isGoogleLensAvailable = await this.appStorageService.get(
      "googleBarcodeScannerModuleAvailability"
    );
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle("dark", this.darkMode);
    if (this.darkMode) {
      this.appStorageService.set("darkModeActivated", true).then((r) => r);
    } else {
      this.appStorageService.set("darkModeActivated", false).then((r) => r);
    }
  }

  async installGoogleBarcodeScannerModule(): Promise<void> {
    const result = await BarcodeScanner.installGoogleBarcodeScannerModule()
      .then(async (result) => {
        await this.dialogService.showLoading({
          message: "Instalowanie Google Lens",
          duration: 2000,
        });
        return result;
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(result);
  }

  async isGoogleBarcodeScannerModuleAvailable() {
    const result = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return result.available;
  }

  saveBarcodeFormats(e: any) {
    this.appStorageService.set("barcodeFormats", e.detail.value).then((r) => r);
  }

  async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  async requestPermissionsCamera(): Promise<void> {
    await BarcodeScanner.requestPermissions().then((r) => {
      if (r.camera === "granted") {
        this.isCameraPermissionGranted = true;
        return "granted";
      } else {
        return "denied";
      }
    });
  }

  async requestPermissionsNotification(): Promise<void> {
    await LocalNotifications.requestPermissions().then((r) => {
      if (r.display === "granted") {
        this.isNotificationPermissionGranted = true;
        return "granted";
      } else {
        return "denied";
      }
    });
  }

  async requestPermissionsLocalization(): Promise<void> {
    await Geolocation.requestPermissions().then((r) => {
      if (r.location === "granted") {
        this.isGeolocationPermissionGranted = true;
        return "granted";
      } else {
        return "denied";
      }
    });
  }
  async toggleLocalizationWatcher(event: any) {
    console.log(event);
    event
      ? await this.stopLocationWatcher()
      : await this.startLocationWatcher();
  }

  async startLocationWatcher() {
    const cards = await this.appStorageService.get("my-cards");
    let watch = navigator.geolocation.watchPosition(
      (position) => {
        if (position) {
          console.log(position);
          let resultOfDistance;
          for (let card of cards) {
            resultOfDistance = this.calculateDistance(
              card.objectLocalization.lat,
              card.objectLocalization.lng,
              position.coords.latitude,
              position.coords.longitude
            );
            console.log(resultOfDistance);
            if (resultOfDistance >= 150) {
            }
          }
        }
      },
      (error) => {
        console.error("Error with watchPosition(): ", error);
      },
      { timeout: 1500, maximumAge: 50, enableHighAccuracy: true }
    );
    this.watchId = watch;
  }

  async stopLocationWatcher() {
    console.log(this.watchId);
    const opt: ClearWatchOptions = { id: this.watchId };
    await Geolocation.clearWatch(opt).then((r) =>
      console.log("My watch has been ended")
    );
  }

  async scheduleNotification() {
    let options: ScheduleOptions = {
      notifications: [
        {
          id: 1,
          title: "Cardownik",
          body: "Znajdujesz sie w okolicy zapisanej karty :)",
        },
      ],
    };
    try {
      await LocalNotifications.schedule(options);
    } catch (ex) {
      alert(JSON.stringify(ex));
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const lat1Rad = lat1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);
    const lon1Rad = lon1 * (Math.PI / 180);
    const lon2Rad = lon2 * (Math.PI / 180);
    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;
    const a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.pow(Math.sin(deltaLon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const earthRadius = 6371000;
    return earthRadius * c;
  }
}
