import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DialogService} from "../core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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

  public cardForm: FormGroup;


  @Input()
  public card: Card = {
    id: this._id,
    modified: "",
    objectLocalization: "",
    cardName: "",
    barcode: ""
  }

  constructor(
    private readonly dialogService: DialogService,
    private appStorageService: AppStorageService,
    public formBuilder: FormBuilder) {
  }

  async ngOnInit() {
    this.cardForm = this.formBuilder.group({
      id: new FormControl(),
      cardName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      barcode: new FormControl('', [Validators.required, Validators.minLength(2)]),
      objectLocalization: new FormControl('', [Validators.required, Validators.minLength(2)]),
      modified: new FormControl(new Date().toLocaleString("pl-PL"))
    });
    this._id = await this.appStorageService.get('id');
    this.cardForm.patchValue({id: this.card.id || this._id})
    this.cardForm.patchValue({barcode: this.barcode || this.card.barcode});
    this.cardForm.patchValue({cardName: this.card.cardName || ''});
    this.cardForm.patchValue({objectLocalization: this.card.objectLocalization || ''});
  }

  cancel() {
    return this.dialogService.dismissModal(null, 'cancel');
  }

  confirm() {
    if (this.cardForm.valid) {
      return this.dialogService.dismissModal(this.cardForm, 'confirm');
    }
  }

}
