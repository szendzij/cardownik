import { Component, OnInit } from '@angular/core';
import { Geolocation } from "@capacitor/geolocation";
import { Platform } from '@ionic/angular';
import { AppStorageService } from "../core/services/app-storage/app-storage.service";
import { Card } from "../core/interface/card";

@Component({
  selector: 'app-Maps',
  templateUrl: 'maps.page.html',
  styleUrls: ['maps.page.scss']
})
export class MapsPage implements OnInit {
  public screenHeight: number;
  public screenWidth: number;
  public latitude: number;
  public longitude: number;
  public zoom: number = 15;
  public cards: Card[];
  public markers: any[];
  public markerPosition: google.maps.LatLngLiteral;
  public center: google.maps.LatLngLiteral;

  public tagSvgRaw = (name: string) => `
    <svg xmlns="http://www.w3.org/2000/svg" width="71" height="45" viewBox="0 0 71 45" fill="none">
      <rect width="71" height="37" rx="10" fill="#3880ff"/>
      <path d="M35 45L27 37H43L35 45Z" fill="#3880ff"/>
      <text x="50%" y="24"
            text-anchor="middle" fill="#FFF"
            font-size="14px" font-family="sans-serif" font-weight="bold">
            ${name}
      </text>
    </svg>`;

  public mapOptions: google.maps.MapOptions = {
    minZoom: 1,
    maxZoom: 100,
    disableDefaultUI: true,
    draggable: true,
    clickableIcons: false,
    zoomControl: false,
    scrollwheel: false,
  };

  public card: Card;


  constructor(
    private platform: Platform,
    private appStorageService: AppStorageService
  ) {
  }

  async ngOnInit() {
    this.screenHeight = this.platform.height();
    this.screenWidth = this.platform.width();
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });

  }

  async ionViewWillEnter() {
    await this.addMarkers();
  }

  async addMarkers() {
    this.markers = await this.appStorageService.get('my-cards').then(async cards => {
      const markersArray: any = [];
      let marker;
      for (let card of cards) {
        marker = {
          position: {
            lat: card.objectLocalization.lat,
            lng: card.objectLocalization.lng,
          },
          icon: {
            url: this.encodeSVG(this.tagSvgRaw(card.cardName)),
            scaledSize: new google.maps.Size(64, 64),
          }
        };
        if (marker.position.lat !== null) {
          markersArray.push(marker);
        }
      }
      return markersArray;
    });
  }



  async locate() {
    const geolocation = await Geolocation.getCurrentPosition();
    this.center = {
      lat: geolocation.coords.latitude,
      lng: geolocation.coords.longitude
    }
    this.mapOptions = {
      zoom: this.zoom = 15
    }
  }

  zoomIn() {
    if (this.zoom < 100) this.zoom++;
  }

  zoomOut() {
    if (this.zoom > 1) this.zoom--;
  }

  encodeSVG(rawSvgString: string) {
    const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;
    rawSvgString = rawSvgString
      .replace(/'/g, '"')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ');

    return (
      'data:image/svg+xml;utf-8,' +
      rawSvgString.replace(symbols, encodeURIComponent)
    );
  }

}
