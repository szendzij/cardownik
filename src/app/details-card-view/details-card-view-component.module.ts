import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsCardViewComponent } from "./details-card-view.component";
import { QRCodeModule } from "angularx-qrcode";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, QRCodeModule, GoogleMapsModule],
  declarations: [DetailsCardViewComponent],
  exports: [DetailsCardViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailsCardViewComponentModule { }
