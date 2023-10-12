import { Component, OnInit } from '@angular/core';
import { AppStorageService } from '../core/services/app-storage/app-storage.service';

@Component({
  selector: 'app-Settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  themeToggle: boolean = false;
  darkMode: boolean = false;

  constructor(private appStorageService: AppStorageService) { }

  ngOnInit(): void {
    this.checkAppMode;
  }

  private async checkAppMode() {
    const checkIsDarkMode = await this.appStorageService.get('darkModeActivated');
    console.log(checkIsDarkMode);
    checkIsDarkMode?.value == 'true' ? (this.darkMode = true) : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }

  public async toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      await this.appStorageService.set('darkModeActivated', 'true');
    } else {
      this.appStorageService.set('darkModeActivated', 'false');
    }
  }

}
