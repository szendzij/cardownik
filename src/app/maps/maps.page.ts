import { Component, ElementRef, OnInit } from '@angular/core';
import { Geolocation } from "@capacitor/geolocation";
import { Platform } from '@ionic/angular';

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
  public elementRef: ElementRef;


  public center: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    position: {
      lat: 51.1134163,
      lng: 16.9503138
    }
  };

  public options: google.maps.MapOptions = {
    minZoom: 1,
    maxZoom: 100,
    disableDefaultUI: true,
    draggable: true,
    clickableIcons: false,
    zoomControl: false,
    scrollwheel: false,
  };


  constructor(
    private platform: Platform
  ) { }

  ngOnInit(): void {
    this.screenHeight = this.platform.height();
    this.screenWidth = this.platform.width();
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });
  }


  async locate() {
    const geolocation = await Geolocation.getCurrentPosition();
    this.latitude = geolocation.coords.latitude;
    this.longitude = geolocation.coords.longitude;

    this.center = {
      lat: geolocation.coords.latitude,
      lng: geolocation.coords.longitude

    }
  }

  zoomIn() {
    if (this.zoom < 100) this.zoom++;
  }

  zoomOut() {
    if (this.zoom > 1) this.zoom--;
  }

  clickFab(event: any) {
    event.stopPropagation();
  }
}
