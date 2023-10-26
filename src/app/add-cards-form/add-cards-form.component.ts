import {Component, OnInit} from '@angular/core';
import {DialogService} from "../core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {barcode} from "ionicons/icons";
import {Barcode, BarcodeFormat, BarcodeValueType} from "@capacitor-mlkit/barcode-scanning";
import {AppStorageService} from "../core/services/app-storage/app-storage.service";

@Component({
  selector: 'add-cards-form-component',
  templateUrl: './add-cards-form-component.html',
  styleUrls: ['./add-cards-form.component.scss'],
})
export class AddCardsFormComponent implements OnInit {
  public barcodes: Barcode[] = [];


  public card = new FormGroup({
    shopName: new FormControl('', Validators.required),
    barcode: new FormControl(this.barcodes),
    shopLocalization: new FormControl('', Validators.required),
    modified: new FormControl(new Date().toLocaleString("pl-PL"))
  });

  constructor(
    private readonly dialogService: DialogService,
    private appStorageService: AppStorageService) {
  }

  async ngOnInit() {
    this.barcodes = await this.appStorageService.get('barcode_displayValue');
    this.card.patchValue({barcode: this.barcodes})
  }


  cancel() {
    return this.dialogService.dismissModal(null, 'cancel');
  }

  confirm() {
    return this.dialogService.dismissModal(this.card, 'confirm');
  }

}
