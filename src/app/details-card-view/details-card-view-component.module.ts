import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailsCardViewComponent } from "./details-card-view.component";


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  declarations: [ DetailsCardViewComponent ],
  exports: [ DetailsCardViewComponent ]
})
export class DetailsCardViewComponentModule {}
