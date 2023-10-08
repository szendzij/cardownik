import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
    ],
    declarations: [BarcodeScanningModalComponent]
})
export class BarcodeScanningModalComponentModule { }