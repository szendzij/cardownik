import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Geolocation } from "@capacitor/geolocation";
import { Platform } from "@ionic/angular";
import { AppStorageService } from "../core/services/app-storage/app-storage.service";
import { Card } from "../core/interface/card";

@Component({
  selector: "app-Maps",
  templateUrl: "maps.page.html",
  styleUrls: ["maps.page.scss"],
})
export class MapsPage implements OnInit {
  public screenHeight: number;
  public screenWidth: number;
  public latitude: number;
  public longitude: number;
  public zoom: number = 15;
  private watchId: any;
  public cards: Card[];
  public markers: any[];
  public currentPosition: google.maps.LatLngLiteral;
  public center: google.maps.LatLngLiteral;
  public markerOptions: google.maps.MarkerOptions;

  @ViewChild("map") mapElement: ElementRef;
  public map: google.maps.Map;

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
  ) {}

  async initMap(): Promise<void> {
    const mapProperties = this.mapOptions;
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );
  }
  async ngOnInit() {
    const location = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    this.center = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
    this.markerOptions = {
      position: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      icon: {
        url: "./assets/dot.png",
        scaledSize: new google.maps.Size(24, 24),
      },
    };
    this.screenHeight = this.platform.height();
    this.screenWidth = this.platform.width();
  }

  async ionViewWillEnter() {
    await this.addMarkers();

    // await this.startLocationWatcher();
  }

  // async ionViewDidLeave() {
  //   this.stopLocationWatcher();
  // }

  async addMarkers() {
    this.markers = await this.appStorageService
      .get("my-cards")
      .then(async (cards) => {
        const markersArray: any = [];
        let marker;
        if (cards !== null) {
          for (let card of cards) {
            marker = {
              position: {
                lat: card.objectLocalization.lat,
                lng: card.objectLocalization.lng,
              },
              icon: {
                url: this.encodeSVG(this.tagSvgRaw(card.cardName)),
                scaledSize: new google.maps.Size(64, 64),
              },
            };
            if (marker.position.lat !== null) {
              markersArray.push(marker);
            }
          }
        }
        return markersArray;
      });
  }

  async locate() {
    const geolocation = await Geolocation.getCurrentPosition();
    this.center = {
      lat: geolocation.coords.latitude,
      lng: geolocation.coords.longitude,
    };
    this.mapOptions = {
      zoom: (this.zoom = 15),
    };
    this.markerOptions = {
      position: {
        lat: geolocation.coords.latitude,
        lng: geolocation.coords.longitude,
      },
      icon: {
        url: "./assets/dot.png",
        scaledSize: new google.maps.Size(24, 24),
      },
    };
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
      .replace(/>\s+</g, "><")
      .replace(/\s{2,}/g, " ");

    return (
      "data:image/svg+xml;utf-8," +
      rawSvgString.replace(symbols, encodeURIComponent)
    );
  }
}
