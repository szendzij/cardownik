import {Component, NgZone, OnInit} from '@angular/core';
import {DialogService} from '../core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {BarcodeScanner} from '@capacitor-mlkit/barcode-scanning';
import {FilePicker} from '@capawesome/capacitor-file-picker';
import {AppStorageService} from '../core/services/app-storage/app-storage.service';
import {Card} from "../core/interface/card";
import {AddCardsFormComponent} from "../add-cards-form/add-cards-form.component";
import {DetailsCardViewComponent} from "../details-card-view/details-card-view.component";
import {Platform} from "@ionic/angular";
import {Geolocation} from "@capacitor/geolocation";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public isSupportedDevice = false;
  public isPermissionGranted = false;
  public barcode: string = '';
  public cards: Card[] = [];
  public _id: number = 0;
  public isSupported = false;
  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
  });

  coords: any;

  constructor(
    private appStorageService: AppStorageService,
    private dialogService: DialogService,
    private readonly ngZone: NgZone,
    private platform: Platform) {
  }

  async ngOnInit() {
    this.platform.width();
    if (await this.appStorageService.get('my-cards') != null) {
      this.cards = await this.appStorageService.get('my-cards');
      this._id = await this.appStorageService.get('id');
    }
    if (!this.isSupportedDevice) {
      BarcodeScanner.isSupported().then((result) => {
        this.isSupportedDevice = result.supported;
      });
    }
    await this.appStorageService.set('supportedDevice', this.isSupportedDevice).then(r => r);

    if (!this.isPermissionGranted) {
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
            const {state, progress} = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        }
      );
    });
  }

  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.coords = coordinates.coords;
    alert(coordinates);
    console.log(this.coords)
  }


  async remove(i: any) {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === i)
    this.cards = arrayOfCards.filter((e: any) => e != val);
    await this.appStorageService.set('my-cards', this.cards);
  };

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
    const {barcodes} = await BarcodeScanner.scan({
      formats,
    });
    this.barcode = barcodes[0].displayValue;
    await this.appStorageService.set('barcodeVal', this.barcode);
    await this.showAddCardForm();
  }

  async showAddCardForm() {
    const formElement = await this.dialogService.showModal({
      component: AddCardsFormComponent,
      componentProps: {barcode: this.barcode}
    })
    const {data, role} = await formElement.onWillDismiss();
    if (role == 'confirm') {
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

  //
  // async openCard(i: any) {
  //   const arrayOfCards = await this.appStorageService.get('my-cards');
  //   const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === i)
  //   if (val) {
  //     const formElement = await this.dialogService.showModal({
  //       component: AddCardsFormComponent,
  //       componentProps: {id: i}
  //     })
  //   } else {
  //     console.log(`No shop found with ID ${i}`);
  //   }
  // }

  async openDetailsOfCard(id: any) {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const cardObject: Card = arrayOfCards.find((v: { id: number; }) => v.id === id)
    console.log(cardObject)
    if (cardObject) {
      const formElement = await this.dialogService.showModal({
        component: DetailsCardViewComponent,
        componentProps: {card: cardObject}
      })
    } else {
      console.log(`No shop found with ID ${cardObject}`);
    }
  }

  async showDetailsView(i: number) {
    const formElement = await this.dialogService.showModal({
      component: AddCardsFormComponent,
      componentProps: {id: i}
    })
  }


}
