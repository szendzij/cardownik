import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { SettingsPageRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    SettingsPageRoutingModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule { }
