import { Component, OnInit, ElementRef } from '@angular/core';
import { DialogService } from '../core';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';
import { Card } from "../core/interface/card";
import { AddCardsFormComponent } from "../add-cards-form/add-cards-form.component";
import { DetailsCardViewComponent } from "../details-card-view/details-card-view.component";
import { Platform } from "@ionic/angular";

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
  private _id: number = 0;
  public screenWidth: number = 0;

  constructor(
    private appStorageService: AppStorageService,
    private dialogService: DialogService,
    private platform: Platform) {
  }

  async ngOnInit() {
    this.screenWidth = this.platform.width();
    if (await this.appStorageService.get('my-cards') != null) {
      this.cards = await this.appStorageService.get('my-cards');
      this._id = await this.appStorageService.get('id');
    }
    this.isSupportedDevice = await this.appStorageService.get('supportedDevice');
    this.isPermissionGranted = await this.appStorageService.get('permissionGranted');
  }

  public async readBarcodeFromImage(): Promise<void> {
    const { files } = await FilePicker.pickImages({ multiple: false });
    const path = files[0]?.path;
    if (!path) {
      return;
    }
    const formats = await this.appStorageService.get('barcodeFormats');
    BarcodeScanner.readBarcodesFromImage({
      path,
      formats
    })
      .then(async result => {
        if (result.barcodes[0].displayValue == undefined) {
          await this.dialogService.showAlert({
            message: 'Brak kodu kreskowego na zdjęciu',
          })
        } else {
          this.barcode = result.barcodes[0].displayValue;
          await this.showAddCardForm();
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
      })

  }

  public async scan(): Promise<void> {
    const formats = await this.appStorageService.get('barcodeFormats');
    BarcodeScanner.scan({
      formats
    })
      .then(async result => {
        //to check
        // const found = formats.find((el: BarcodeFormat) => el === result.barcodes[0].format)
        // await this.dialogService.showErrorAlert({ message: 'znaleziono format' })

        this.barcode = result.barcodes[0].displayValue;
        await this.showAddCardForm();
      })
      .catch((error) => {
        console.log('Error', error);
      })
  }

  async showAddCardForm() {
    const formElement = await this.dialogService.showModal({
      component: AddCardsFormComponent,
      componentProps: { barcode: this.barcode }
    })
    const { data, role } = await formElement.onWillDismiss();
    if (role == 'confirm') {
      this.cards.unshift({
        id: this._id,
        cardName: data.value.cardName,
        objectLocalization: {
          loc: data.value.objectLocalization.loc,
          lat: data.value.objectLocalization.lat,
          lng: data.value.objectLocalization.lng
        },
        modified: data.value.modified,
        barcode: data.value.barcode
      })

      this._id++;
      await this.appStorageService.set('id', this._id);
      await this.appStorageService.set('my-cards', this.cards);
      this.barcode = '';
    }
  }


  async openDetailsOfCard(id: any) {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const cardObject: Card = arrayOfCards.find((v: { id: number; }) => v.id === id)
    if (cardObject) {
      const cardDetail = await this.dialogService.showModal({
        component: DetailsCardViewComponent,
        componentProps: { card: cardObject }
      })
      const { data, role } = await cardDetail.onWillDismiss();
      if (role == 'delete') {
        this.cards = data;
      } else if (role == 'confirm') {
        this.cards = data;
      } else if (role == 'back') {
        this.cards = data;
      }
    } else {
      await this.dialogService.showErrorAlert({ message: 'Wystąpił problem z otwarciem szczegółów karty' })
    }
  }

}
