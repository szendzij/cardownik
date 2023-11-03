import { Component, OnInit, ElementRef } from '@angular/core';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  constructor(
    private appStorageService: AppStorageService) { }

  async ngOnInit(): Promise<void> {
    await this.checkAppMode();
  }

  public async checkAppMode() {
    const darkMode = await this.appStorageService.get('darkModeActivated');
    document.body.classList.toggle('dark', darkMode);
  }

}
