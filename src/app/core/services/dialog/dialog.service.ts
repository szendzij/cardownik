import {Injectable} from '@angular/core';
import {
  ActionSheetController, ActionSheetOptions,
  AlertController, AnimationController,
  LoadingController,
  ModalController,
  PopoverController, ToastController,
} from '@ionic/angular';
import {
  AlertOptions,
  LoadingOptions,
  ModalOptions,
  PopoverOptions,
} from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController,
  ) {
  }

  public async showAlert(opts?: AlertOptions): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
    return alert;
  }

  public async showErrorAlert(
    opts?: AlertOptions
  ): Promise<HTMLIonAlertElement> {
    const defaultOpts: AlertOptions = {
      header: 'Błąd',
      buttons: ['OK'],
    };
    opts = {...defaultOpts, ...opts};
    return this.showAlert(opts);
  }

  public async showModal(opts: ModalOptions): Promise<HTMLIonModalElement> {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    return modal;
  }

  public async dismissModal(data?: any, role?: string): Promise<boolean> {
    return this.modalCtrl.dismiss(data, role);
  }

  public async showPopover(
    opts: PopoverOptions
  ): Promise<HTMLIonPopoverElement> {
    const popover = await this.popoverCtrl.create(opts);
    await popover.present();
    return popover;
  }

  public async showLoading(
    opts?: LoadingOptions
  ): Promise<HTMLIonLoadingElement> {
    const defaultOpts: LoadingOptions = {
      message: 'Proszę czekać...',
    };
    opts = {...defaultOpts, ...opts};
    const loading = await this.loadingCtrl.create(opts);
    await loading.present();
    return loading;
  }
}
