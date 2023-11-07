import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogService } from "../core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Card } from "../core/interface/card";
import { AppStorageService } from "../core/services/app-storage/app-storage.service";
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'add-cards-form-component',
  templateUrl: './add-cards-form-component.html',
  styleUrls: ['./add-cards-form.component.scss'],
})
export class AddCardsFormComponent implements OnInit {
  @Input()
  public barcode: string = '';
  public latitude: number;
  public longitude: number;
  public _id: number = 0;
  public cardForm: FormGroup;


  @Input()
  public card: Card;

  constructor(
    private readonly dialogService: DialogService,
    public formBuilder: FormBuilder) {
    this.cardForm = this.formBuilder.group({
      id: [],
      cardName: ['', [Validators.required, Validators.minLength(2)]],
      barcode: ['', [Validators.required, Validators.minLength(2)]],
      objectLocalization: this.formBuilder.group({
        loc: [''],
        lat: [],
        lng: []
      }),
      modified: [new Date().toLocaleString("pl-PL")]
    });
  }

  async ngOnInit() {
    if (this.card == undefined) {
      this.cardForm.patchValue({
        id: this._id,
        barcode: this.barcode
      })
    } else {
      this.cardForm.patchValue({
        id: this.card.id,
        barcode: this.card.barcode,
        cardName: this.card.cardName,
        objectLocalization: {
          loc: this.card.objectLocalization.loc,
        }
      })
    }
  }

  cancel() {
    return this.dialogService.dismissModal(null, 'cancel');
  }

  async confirm() {
    const locationObject = this.cardForm.controls['objectLocalization'].value;
    await NativeGeocoder.forwardGeocode({
      addressString: locationObject.loc,
      apiKey: environment.apiKey
    }).then(location => {
      this.cardForm.patchValue({
        objectLocalization: {
          lat: location.addresses[0].latitude,
          lng: location.addresses[0].longitude
        }
      })
      if (this.cardForm.valid) {
        console.log(this.cardForm)
        return this.dialogService.dismissModal(this.cardForm, 'confirm');
      }
    })
      .catch(error => {
        console.info("Not found given address");
        return this.dialogService.dismissModal(this.cardForm, 'confirm');
      })
  }
}
