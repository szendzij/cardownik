import { Component, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { AppStorageService } from './core/services/app-storage/app-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private appStorageService: AppStorageService,
    private alertController: AlertController) {
    this.backButtonEvent();
  }
  async ngOnInit(): Promise<void> {
    this.appStorageService.init();
  }


  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.backButtonAlert();
    });
  }

  async backButtonAlert() {
    const alert = await this.alertController.create({
      message: 'You just pressed the back button!'
    });
    await alert.present();
  }
}
