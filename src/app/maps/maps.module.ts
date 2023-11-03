import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapsPage } from './maps.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MapsPageRoutingModule } from './maps-routing.module';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    MapsPageRoutingModule
  ],
  declarations: [MapsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class MapsPageModule { }
