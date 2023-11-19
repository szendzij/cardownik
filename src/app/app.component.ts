import { Component, NgZone, OnInit } from "@angular/core";
import { AppStorageService } from "./core/services/app-storage/app-storage.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private appStorageService: AppStorageService) {}

  async ngOnInit(): Promise<void> {
    await this.appStorageService.init();
  }
}
