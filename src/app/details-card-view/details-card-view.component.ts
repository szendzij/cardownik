import { AfterViewInit, Component, Input, OnInit, Output, ElementRef } from '@angular/core';
import { DialogService } from "../core";
import { AppStorageService } from "../core/services/app-storage/app-storage.service";
import { Card } from "../core/interface/card";
import { ModalController, Platform } from "@ionic/angular";
import { AddCardsFormComponent } from "../add-cards-form/add-cards-form.component";
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'details-card-view-component',
  templateUrl: './details-card-view-component.html',
  styleUrls: ['./details-card-view.component.scss'],
})
export class DetailsCardViewComponent implements OnInit {
  public screenWidth: number = 0;
  public screenHeight: number = 0;
  public latitude: number;
  public longitude: number;
  public center: google.maps.LatLngLiteral;
  public markerPosition: google.maps.LatLngLiteral;
  public markerOptions: google.maps.MarkerOptions = {
    draggable: false
  }
  public options: google.maps.MapOptions = {
    zoom: 15,
    disableDefaultUI: true,
    draggable: false,
    clickableIcons: false,
  }

  @Output()
  public cards: Card[] = [];

  @Input()
  public card: any;

  constructor(
    private readonly dialogService: DialogService,
    private appStorageService: AppStorageService,
    private platform: Platform,
    private modalCtrl: ModalController) {
  }

  async ngOnInit() {
    this.geocoding(this.card.objectLocalization);
    this.screenWidth = this.platform.width();
    this.screenHeight = this.platform.height();
    this.platform.backButton.subscribeWithPriority(999, async () => {
      const modal = await this.modalCtrl.getTop();
      if (modal) {
        this.cards = await this.appStorageService.get('my-cards');
        return await modal.dismiss(this.cards, 'back');
      }
    })
    this.screenHeight = this.platform.height();
    this.screenWidth = this.platform.width();
  }

  async editCard() {
    const cardDetail = await this.dialogService.showModal({
      component: AddCardsFormComponent,
      componentProps: { card: this.card }
    })
    const { data, role } = await cardDetail.onWillDismiss();
    if (role == 'confirm') {
      this.card = data.value;
      let arrayOfCards = await this.appStorageService.get('my-cards');
      const cardIndex = arrayOfCards.findIndex((v: { id: number; }) => v.id === data.value.id);
      arrayOfCards[cardIndex] = data.value;
      arrayOfCards = Object.assign([], arrayOfCards);
      this.cards = arrayOfCards;
      await this.appStorageService.set('my-cards', this.cards);
    }
  }

  async removeCard() {
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === this.card.id);
    this.cards = arrayOfCards.filter((e: any) => e != val);
    await this.appStorageService.set('my-cards', this.cards);
    console.log(this.cards);
    return this.dialogService.dismissModal(this.cards, 'delete');
  };


  async back() {
    this.cards = await this.appStorageService.get('my-cards');
    return this.dialogService.dismissModal(this.cards, 'back');
  }


  async geocoding(localization: string) {
    const location = await NativeGeocoder.forwardGeocode({
      addressString: localization,
      apiKey: environment.apiKey
    })
    this.center = {
      lat: location.addresses[0].latitude,
      lng: location.addresses[0].longitude
    }
    this.markerPosition = {
      lat: location.addresses[0].latitude,
      lng: location.addresses[0].longitude
    }
  }

}
