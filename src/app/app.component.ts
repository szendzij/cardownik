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

  constructor(
    private platform: Platform,
    private appStorageService: AppStorageService,
    private alertController: AlertController,
    @Optional() private routerOutlet?: IonRouterOutlet) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      // @ts-ignore
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp().then(r => r);
      }
    });
  }
  async ngOnInit(): Promise<void> {
    await this.appStorageService.init();
  }


  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.backButtonAlert().then(r => r);
    });
  }

  async backButtonAlert() {
    const alert = await this.alertController.create({
      message: 'You just pressed the back button!'
    });
    await alert.present();
  }
}
