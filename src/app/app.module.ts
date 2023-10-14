import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QrCodeModule } from 'ng-qrcode';
import { BarcodeScanningModalComponentModule } from './barcode-scanning-modal/barcode-scaning-modal-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorHandlerService } from './core/services/global-error-handler/global-error-handler.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    QrCodeModule,
    BarcodeScanningModalComponentModule,
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
