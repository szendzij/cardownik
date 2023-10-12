import { Component, OnInit } from '@angular/core';
import { RefresherCustomEvent, ToastController } from '@ionic/angular';
import { DialogService } from '../core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Barcode, BarcodeFormat, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { BarcodeScanningModalComponent } from '../barcode-scanning-modal/barcode-scanning-modal.component';
import { AppStorageService, Card } from './../core/services/app-storage/app-storage.service';


@Component({
  selector: 'app-Home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public value: any = '';

  card: Card[] = [];

  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;
  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
  });

  constructor(
    private appStorageService: AppStorageService,
    private dialogService: DialogService) { }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
  }

  async setValue() {
    await this.appStorageService.set('country', 'Polska');
  }

  async getValue() {
    this.value = await this.appStorageService.get('country');
  }

  async removeValue() {
    await this.appStorageService.remove('country');
  }

  async clearStorage() {
    await this.appStorageService.clear();
  }






  public async startScan(): Promise<void> {
    const formats = this.formGroup.get('formats')?.value || [];
    const lensFacing =
      this.formGroup.get('lensFacing')?.value || LensFacing.Back;
    const element = await this.dialogService.showModal({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: formats,
        lensFacing: lensFacing,
      },
    });
    element.onDidDismiss().then((result) => {
      const barcode: Barcode | undefined = result.data?.barcode;
      if (barcode) {
        // this.barcodes = [barcode];
        this.barcodes.push(barcode)
      }
    });
  }

  public async readBarcodeFromImage(): Promise<void> {
    const { files } = await FilePicker.pickImages({ multiple: false });
    const path = files[0]?.path;
    if (!path) {
      return;
    }
    const formats = this.formGroup.get('formats')?.value || [];
    const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
      formats,
      path,
    });
    // this.barcodes = barcodes;
    this.barcodes.push(...barcodes);
  }



}
