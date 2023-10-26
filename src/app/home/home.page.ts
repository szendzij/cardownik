import {Component, Input, NgZone, OnInit} from '@angular/core';
import {DialogService} from '../core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {Barcode, BarcodeFormat, BarcodeScanner, BarcodeValueType, LensFacing} from '@capacitor-mlkit/barcode-scanning';
import {FilePicker} from '@capawesome/capacitor-file-picker';
import {AppStorageService} from '../core/services/app-storage/app-storage.service';
import {Card} from "../core/interface/card";
import {AddCardsFormComponent} from "../add-cards-form/add-cards-form.component";


@Component({
  selector: 'app-Home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public isSupportedDevice = false;
  public isPermissionGranted = false;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  public barcode: string = '';

  public cards: Card[] = [];
  public _id: number = 0;

  public isSupported = false;

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
  });


  constructor(
    private appStorageService: AppStorageService,
    private dialogService: DialogService,
    private readonly ngZone: NgZone) {
  }

  async ngOnInit() {
    if (await this.appStorageService.get('my-cards') != null) {
      this.cards = await this.appStorageService.get('my-cards');
      this._id = await this.appStorageService.get('id');
    }
    if(!this.isSupportedDevice) {
      BarcodeScanner.isSupported().then((result) => {
        this.isSupportedDevice = result.supported;
      });
    }
    await this.appStorageService.set('supportedDevice', this.isSupportedDevice).then(r => r);

    if(!this.isPermissionGranted) {
      BarcodeScanner.checkPermissions().then((result) => {
        this.isPermissionGranted = result.camera === 'granted';
      });
    }
    await this.appStorageService.set('permissionGranted', this.isPermissionGranted).then(r => r);

    BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
          'googleBarcodeScannerModuleInstallProgress',
          (event) => {
            this.ngZone.run(() => {
              console.log('googleBarcodeScannerModuleInstallProgress', event);
              const { state, progress } = event;
              this.formGroup.patchValue({
                googleBarcodeScannerModuleInstallState: state,
                googleBarcodeScannerModuleInstallProgress: progress,
              });
            });
          }
      );
    });
  }


  async remove(i: any) {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === i)
    this.cards = arrayOfCards.filter((e: any) => e != val);
    await this.appStorageService.set('my-cards', this.cards);
  };

  showBarodeArray() {
    console.log(`saddasd ${this.barcode}`)
  }

  async openCard(i: any) {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === i)
    if (val) {
      console.log(`shop found with ID ${i}`);
    } else {
      console.log(`No shop found with ID ${i}`);
    }
  }

  // async updateCard(key: string, card: Card) {
  //   // Get the map from local storage.
  //   const map = await this.appStorageService.get('my-map');
  //
  //   // Get the card from the map.
  //   const cardToUpdate: Card = map.get(key);
  //
  //   // Update the values of the card.
  //   cardToUpdate.shopName = card.shopName;
  //   cardToUpdate.barcode = card.barcode;
  //   cardToUpdate.shopLocalization = card.shopLocalization;
  //   cardToUpdate.modified = card.modified;
  //
  //   map.set(key, cardToUpdate);
  //
  //   await this.appStorageService.set('my-map', map);
  // }

  // public async startScan(): Promise<void> {
  //   const formats = this.formGroup.get('formats')?.value || [];
  //   const lensFacing =
  //     this.formGroup.get('lensFacing')?.value || LensFacing.Back;
  //   const element = await this.dialogService.showModal({
  //     component: BarcodeScanningModalComponent,
  //     cssClass: 'barcode-scanning-modal',
  //     showBackdrop: false,
  //     componentProps: {
  //       formats: formats,
  //       lensFacing: lensFacing,
  //     },
  //   });
  //   element.onDidDismiss().then((result) => {
  //     const barcode: Barcode | undefined = result.data?.barcode;
  //     if (barcode) {
  //       this.barcodes.push(barcode);
  //     }
  //   });
  //   await this.showAddCardForm();
  // }

  public async readBarcodeFromImage(): Promise<void> {
    const {files} = await FilePicker.pickImages({multiple: false});
    const path = files[0]?.path;
    if (!path) {
      return;
    }
    const formats = await this.appStorageService.get('barcodeFormats');
    const {barcodes} = await BarcodeScanner.readBarcodesFromImage({
      path,
      formats
    });
    this.barcode = barcodes[0].displayValue;
    await this.appStorageService.set('barcodeVal', this.barcode);
    await this.showAddCardForm();
  }

  public async scan(): Promise<void> {
    const formats = await this.appStorageService.get('barcodeFormats');
    const { barcodes } = await BarcodeScanner.scan({
      formats,
    });
    this.barcode = barcodes[0].displayValue;
    await this.appStorageService.set('barcodeVal', this.barcode);
    await this.showAddCardForm();
  }

  async showAddCardForm() {
    const formElement = await this.dialogService.showModal({
      component: AddCardsFormComponent
    })
    const { data, role } = await formElement.onWillDismiss();
    if(role == 'confirm') {
      this.cards.push({
        id: this._id,
        shopName: data.value.shopName,
        shopLocalization: data.value.shopLocalization,
        modified: data.value.modified,
        barcode: data.value.barcode
      })
      this._id++;
      await this.appStorageService.set('id', this._id);
      await this.appStorageService.set('my-cards', this.cards);

    }
  }


}
