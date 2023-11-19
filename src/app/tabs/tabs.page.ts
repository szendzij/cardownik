import { Component, OnInit, ElementRef } from "@angular/core";
import { AppStorageService } from "../core/services/app-storage/app-storage.service";
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Geolocation } from "@capacitor/geolocation";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage implements OnInit {
  constructor(private appStorageService: AppStorageService) {}

  async ngOnInit(): Promise<void> {
    await this.checkAppMode();

    const isGoogleBarcodeScannerModuleAvailable =
      BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
        .then((r) => r.available)
        .catch((error) => {
          console.error(error);
          return false;
        });
    await this.appStorageService.set(
      "googleBarcodeScannerModuleAvailability",
      isGoogleBarcodeScannerModuleAvailable
    );

    const isSupported = BarcodeScanner.isSupported()
      .then((r) => r.supported)
      .catch((error) => {
        console.error(error);
        return false;
      });
    await this.appStorageService.set("supportedDevice", isSupported);

    const checkPermissionsCamera = BarcodeScanner.checkPermissions()
      .then((r) => r.camera === "granted")
      .catch((error) => {
        console.error(error);
        return "denied";
      });
    await this.appStorageService.set(
      "cameraPermission",
      checkPermissionsCamera
    );

    const checkPermissionsNotification = LocalNotifications.checkPermissions()
      .then((r) => r.display === "granted")
      .catch((error) => {
        console.log(error);
        return "denied";
      });
    await this.appStorageService.set(
      "notificationPermission",
      checkPermissionsNotification
    );

    const checkPermissionsGeolocation = Geolocation.checkPermissions()
      .then((r) => r.location === "granted")
      .catch((error) => {
        console.log(error);
        return "denied";
      });
    await this.appStorageService.set(
      "geolocationPermission",
      checkPermissionsGeolocation
    );

    const installGoogleBarcodeScannerModuleStatus =
      await BarcodeScanner.installGoogleBarcodeScannerModule()
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    console.log(installGoogleBarcodeScannerModuleStatus);
  }

  public async checkAppMode() {
    const darkMode = await this.appStorageService.get("darkModeActivated");
    document.body.classList.toggle("dark", darkMode);
  }
}
