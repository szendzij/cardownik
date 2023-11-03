import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapType } from "@capacitor/google-maps";
import { environment } from "../../environments/environment";
import { Geolocation } from "@capacitor/geolocation";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-Maps',
  templateUrl: 'maps.page.html',
  styleUrls: ['maps.page.scss']
})
export class MapsPage implements OnInit {
  // @ViewChild('map', { static: true })
  // mapRef: ElementRef;
  // map: GoogleMap;
  public screenHeight: number;
  public screenWidth: number;
  public latitude: number;
  public longitude: number;
  markerOptions: google.maps.MarkerOptions;
  options: google.maps.MapOptions;



  constructor(
    // private elementRef: ElementRef,
    private platform: Platform
  ) { }

  ngOnInit(): void {
    this.screenHeight = this.platform.height();
    this.screenWidth = this.platform.width();
    this.locate();

    this.markerOptions = {
      draggable: false,
      position: {
        lat: 51.1134163,
        lng: 16.9503138
      }
    };

    this.options = {
      zoom: 13,
      disableDefaultUI: true,
      draggable: true,
      clickableIcons: false,
      center: {
        lat: 51.1134163,
        lng: 16.9503138
      }
    }
  }







  async locate() {
    const geolocation = await Geolocation.getCurrentPosition();
    this.latitude = geolocation.coords.latitude;
    this.longitude = geolocation.coords.longitude;
    console.log(Number(this.latitude));
    console.log(Number(this.longitude));

  }


}
