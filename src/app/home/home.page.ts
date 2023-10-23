import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogService} from '../core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {Barcode, BarcodeFormat, BarcodeScanner, BarcodeValueType, LensFacing} from '@capacitor-mlkit/barcode-scanning';
import {FilePicker} from '@capawesome/capacitor-file-picker';
import {BarcodeScanningModalComponent} from '../barcode-scanning-modal/barcode-scanning-modal.component';
import {AppStorageService} from '../core/services/app-storage/app-storage.service';
import {Card} from "../core/interface/card";
import {AddCardsFormComponent} from "../add-cards-form/add-cards-form.component";

@Component({
  selector: 'app-Home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public value: any = '';

  public map: Map<string, any> = new Map();

  public test: Card[] = [];

  public readonly barcodeFormat = BarcodeFormat;
  public readonly lensFacing = LensFacing;
  public barcodes: Barcode[] = [];
  public cards: Card[] = [];
  public isSupported = false;
  public isPermissionGranted = false;

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
  });



  constructor(
    private appStorageService: AppStorageService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    // await this.setValue();
    // const map = await this.appStorageService.get('my-map');
    // const cards: Card[] = [];
    //
    // for(const card of map.values()) {
    //   cards.push(card);
    // }
    //
    // this.cards = cards;

    this.cards = await this.appStorageService.get('my-cards');

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
  }


  async remove(no: any) {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === 1)
    const newArrayOfCards = arrayOfCards.filter((e: any) => e != val);
    console.log(newArrayOfCards);
    await this.appStorageService.set('my-cards', newArrayOfCards);
  };


  async setValue() {
    this.cards.push({
      shopName: `dasdasdasd ${Date.now()}`,
      shopLocalization: 'pcim',
      modified: new Date().toLocaleString("pl-PL"),
      id: 1,
      barcode: {
        rawValue: '',
        valueType: BarcodeValueType.Unknown,
        displayValue: 'test',
        format: BarcodeFormat.Aztec,
        bytes:  [33, 263],
      }
    })
    this.cards.push({
      shopName: `dasdasdasd ${Date.now()}`,
      shopLocalization: 'pcim',
      modified: new Date().toLocaleString("pl-PL"),
      id: 2,
      barcode: {
        rawValue: '',
        valueType: BarcodeValueType.Unknown,
        displayValue: 'ewa',
        format: BarcodeFormat.Aztec,
        bytes:  [33, 263],
      }
    })
    this.cards.push({
      shopName: `dasdasdasd ${Date.now()}`,
      shopLocalization: 'pcim',
      modified: new Date().toLocaleString("pl-PL"),
      id: 3,
      barcode: {
        rawValue: '',
        valueType: BarcodeValueType.Unknown,
        displayValue: 'adam',
        format: BarcodeFormat.Aztec,
        bytes:  [33, 263],
      }
    })
    // console.log(this.test)

    const val = this.cards.find(v => v.id === 1)
    if (val) {
      console.log(val.shopName); // "Alice"
    } else {
      console.log("No shop found with ID 1");
    }

    await this.appStorageService.set('my-cards', this.cards);
    const objReturn = await this.appStorageService.get('my-cards');

    console.log(objReturn);

  }

  async getValue() {
    const arrayOfCards = await  this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === 1)
    if (val) {
      console.log(val.shopName); // "Alice"
    } else {
      console.log("No shop found with ID 1");
    }  }

  async updateCard(key: string, card: Card) {
    // Get the map from local storage.
    const map = await this.appStorageService.get('my-map');

    // Get the card from the map.
    const cardToUpdate: Card = map.get(key);

    // Update the values of the card.
    cardToUpdate.shopName = card.shopName;
    cardToUpdate.barcode = card.barcode;
    cardToUpdate.shopLocalization = card.shopLocalization;
    cardToUpdate.modified = card.modified;

    map.set(key, cardToUpdate);

    await this.appStorageService.set('my-map', map);
  }

  async removeValue() {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === 1)
    const newArrayOfCards = arrayOfCards.filter((e: any) => e != val);
    console.log(newArrayOfCards);
    await this.appStorageService.set('my-cards', newArrayOfCards);
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
        this.barcodes.push(barcode);
      }
    });
    await this.showAddCardForm();
  }

  async showAddCardForm() {
    const formElement = await this.dialogService.showModal({
      component: AddCardsFormComponent
    })
    formElement.onDidDismiss().then((result) => {
      console.log(result);
    })
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
    this.barcodes.push(...barcodes);
    await this.showAddCardForm();
  }



}
