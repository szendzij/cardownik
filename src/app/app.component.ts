import {Component, NgZone, OnInit} from '@angular/core';
import {AppStorageService} from './core/services/app-storage/app-storage.service';
import {BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";
import {LocalNotifications} from "@capacitor/local-notifications";
import {Geolocation} from "@capacitor/geolocation";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private appStorageService: AppStorageService) {

  }

  async ngOnInit(): Promise<void> {
    await this.appStorageService.init();

    const isGoogleBarcodeScannerModuleAvailable = BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()
      .then(r => r.available)
      .catch(error => {
        console.log(error);
        return false;
      });
    await this.appStorageService.set('googleBarcodeScannerModule', isGoogleBarcodeScannerModuleAvailable);

    const isSupported = BarcodeScanner.isSupported()
      .then(r => r.supported)
      .catch(error => {
        console.log(error);
        return false;
      });
    await this.appStorageService.set('supportedDevice', isSupported);

    const checkPermissionsCamera = BarcodeScanner.checkPermissions()
      .then(r => r.camera === 'granted')
      .catch(error => {
        console.log(error);
        return "denied";
      });
    await this.appStorageService.set('cameraPermission', checkPermissionsCamera);


    const checkPermissionsNotification = LocalNotifications.checkPermissions()
      .then(r => r.display === 'granted')
      .catch(error => {
        console.log(error);
        return "denied";
      });
    await this.appStorageService.set('notificationPermission', checkPermissionsNotification);

    const checkPermissionsGeolocation = Geolocation.checkPermissions()
      .then(r => r.location === 'granted')
      .catch(error => {
        console.log(error);
        return "denied";
      });
    await this.appStorageService.set('geolocationPermission', checkPermissionsGeolocation);

    // const installGoogleBarcodeScannerModuleStatus = await BarcodeScanner.installGoogleBarcodeScannerModule()
    //   .then(result => {
    //     console.log(result)
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // console.log(installGoogleBarcodeScannerModuleStatus)

  }
}
