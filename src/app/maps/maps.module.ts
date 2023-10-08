import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapsPage } from './maps.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MapsPageRoutingModule } from './maps-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MapsPageRoutingModule
  ],
  declarations: [MapsPage]
})
export class MapsPageModule { }
