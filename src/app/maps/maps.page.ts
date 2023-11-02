import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapType} from "@capacitor/google-maps";
import {environment} from "../../environments/environment";
import {Geolocation} from "@capacitor/geolocation";

@Component({
  selector: 'app-Maps',
  templateUrl: 'maps.page.html',
  styleUrls: ['maps.page.scss']
})
export class MapsPage implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('map', {static: true})
  mapRef: ElementRef;
  map: GoogleMap;
  private latitude: number;
  private longitude: number;
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.locate().then(r => r);
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'transparent';
  }
  ngOnDestroy(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '--ion-background-color';
  }



  ngAfterViewInit() {
    this.createMap().then(r => r);
  }


    async createMap() {
    this.map = await GoogleMap.create({
      id: 'map',
      element: this.mapRef.nativeElement,
      apiKey: environment.apiKey,
      forceCreate: true,
      config: {
        center: {
          lat: 51.1134163,
          lng: 16.9503138,
        },
        zoom: 12,
      },
    });
    await this.map.setMapType(MapType.Normal)

  }

  addMarkers() {

  }


  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.latitude = coordinates.coords.latitude;
    this.longitude = coordinates.coords.longitude;
    console.log(this.latitude)
    console.log(this.longitude)


  }


}
