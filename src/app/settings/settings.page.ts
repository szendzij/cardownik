import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-Settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {
  themeToggle: boolean = false;
  darkMode: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.checkAppMode;
  }

  private async checkAppMode() {
    const checkIsDarkMode = await Preferences.get({ key: 'darkModeActivated' });
    checkIsDarkMode?.value == 'true' ? (this.darkMode = true) : (this.darkMode = false);
    document.body.classList.toggle('dark', this.darkMode);
  }

  public toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    if (this.darkMode) {
      Preferences.set({ key: 'darkModeActivated', value: 'true' });
    } else {
      Preferences.set({ key: 'darkModeActivated', value: 'false' });
    }
  }

}
