import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from "../core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Card} from "../core/interface/card";
import {AppStorageService} from "../core/services/app-storage/app-storage.service";

@Component({
  selector: 'add-cards-form-component',
  templateUrl: './add-cards-form-component.html',
  styleUrls: ['./add-cards-form.component.scss'],
})
export class AddCardsFormComponent implements OnInit {
  @Input()
  public barcode: string = '';

  public _id: number = 0;

  @Input()
  public card: Card = {
    id: this._id,
    modified: "",
    shopLocalization: "",
    shopName: "",
    barcode: ""
  }


  public cardForm = new FormGroup({
    id: new FormControl(),
    shopName: new FormControl('', Validators.required),
    barcode: new FormControl(''),
    shopLocalization: new FormControl('', Validators.required),
    modified: new FormControl(new Date().toLocaleString("pl-PL"))
  });

  constructor(
    private readonly dialogService: DialogService,
    private appStorageService: AppStorageService) {
  }

  async ngOnInit() {
    this._id = await this.appStorageService.get('id');
    this.cardForm.patchValue({id: this.card.id || this._id})
    this.cardForm.patchValue({barcode: this.barcode || this.card.barcode});
    this.cardForm.patchValue({shopName: this.card.shopName || ''});
    this.cardForm.patchValue({shopLocalization: this.card.shopLocalization || ''});
  }


  cancel() {
    return this.dialogService.dismissModal(null, 'cancel');
  }

  confirm() {
    return this.dialogService.dismissModal(this.cardForm, 'confirm');
  }


}
