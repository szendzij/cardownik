import {Component, NgZone, OnInit} from '@angular/core';
import { AppStorageService } from './core/services/app-storage/app-storage.service';
import {BarcodeScanner} from "@capacitor-mlkit/barcode-scanning";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly ngZone: NgZone;

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

    const checkPermissions = BarcodeScanner.checkPermissions()
      .then(r => r.camera === 'granted')
      .catch(error => {
        console.log(error);
        return "denied";
      });
    await this.appStorageService.set('permissionGranted', checkPermissions);

   BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            const {state, progress} = event;
            // this.formGroup.patchValue({
            //   googleBarcodeScannerModuleInstallState: state,
            //   googleBarcodeScannerModuleInstallProgress: progress,
            // });

            console.log(state)
            console.log(progress)
          });
        }
      );
    });
  }
}
