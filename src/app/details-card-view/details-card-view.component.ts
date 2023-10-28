import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from "../core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppStorageService} from "../core/services/app-storage/app-storage.service";
import {Card} from "../core/interface/card";
import {card} from "ionicons/icons";
import {Platform} from "@ionic/angular";

@Component({
  selector: 'details-card-view-component',
  templateUrl: './details-card-view-component.html',
  styleUrls: ['./details-card-view.component.scss'],
})
export class DetailsCardViewComponent implements OnInit {
  public screenWidth: number = 0;

  @Input()
  public card: any;


  // public cardForm = new FormGroup({
  //   shopName: new FormControl('', Validators.required),
  //   barcode: new FormControl(''),
  //   shopLocalization: new FormControl('', Validators.required),
  //   modified: new FormControl(new Date().toLocaleString("pl-PL"))
  // });

  constructor(
    private readonly dialogService: DialogService,
    private platform: Platform) {
  }

  async ngOnInit() {
    this.screenWidth = this.platform.width();
    // console.log(this.card)
    // this.cardForm.patchValue({
    //   barcode: this.card.barcode,
    //   shopName: this.card.shopName,
    //   shopLocalization: this.card.shopLocalization
    // });
  }

  editCard() {
    console.log(`test ${this.card}`)
  }


  back() {
    return this.dialogService.dismissModal(null, 'cancel');
  }
  //
  // confirm() {
  //   return this.dialogService.dismissModal(this.cardForm, 'confirm');
  // }

}
