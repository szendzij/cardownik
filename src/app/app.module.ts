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
import {DetailsCardViewComponentModule} from "./details-card-view/details-card-view-component.module";


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    QRCodeModule,
    AddCardsFormComponentModule,
    DetailsCardViewComponentModule,
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
