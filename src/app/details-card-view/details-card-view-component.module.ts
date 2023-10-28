import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsCardViewComponent } from "./details-card-view.component";
import {QRCodeModule} from "angularx-qrcode";


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, QRCodeModule],
  declarations: [ DetailsCardViewComponent ],
  exports: [ DetailsCardViewComponent ]
})
export class DetailsCardViewComponentModule {}
