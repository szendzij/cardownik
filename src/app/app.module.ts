import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorHandlerService } from './core';
import { AddCardsFormComponentModule } from "./add-cards-form/add-cards-form-component.module";
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    QRCodeModule,
    AddCardsFormComponentModule,
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
