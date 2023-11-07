import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddCardsFormComponent } from "./add-cards-form.component";
import { QRCodeModule } from "angularx-qrcode";


@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, QRCodeModule],
  declarations: [AddCardsFormComponent],
  exports: [AddCardsFormComponent]
})
export class AddCardsFormComponentModule { }
