import {Component, OnInit, Optional} from '@angular/core';
import {AlertController, IonRouterOutlet, Platform} from '@ionic/angular';
import { AppStorageService } from './core/services/app-storage/app-storage.service';
import {App} from "@capacitor/app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private appStorageService: AppStorageService) {

  }
  async ngOnInit(): Promise<void> {
    await this.appStorageService.init();
  }
}
