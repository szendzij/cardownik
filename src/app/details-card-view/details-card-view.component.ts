import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogService} from "../core";
import {AppStorageService} from "../core/services/app-storage/app-storage.service";
import {Card} from "../core/interface/card";
import {Platform} from "@ionic/angular";
import {AddCardsFormComponent} from "../add-cards-form/add-cards-form.component";

@Component({
  selector: 'details-card-view-component',
  templateUrl: './details-card-view-component.html',
  styleUrls: ['./details-card-view.component.scss'],
})
export class DetailsCardViewComponent implements OnInit {
  public screenWidth: number = 0;

  @Output()
  public cards: Card[] = [];

  @Input()
  public card: any;

  constructor(
    private readonly dialogService: DialogService,
    private appStorageService: AppStorageService,
    private platform: Platform) {

  }

  async ngOnInit() {
    this.screenWidth = this.platform.width();
  }

  async editCard() {
      const cardDetail = await this.dialogService.showModal({
        component: AddCardsFormComponent,
        componentProps: {card: this.card}
      })
      const {data, role} = await cardDetail.onWillDismiss();
      if(role == 'confirm') {
        this.card = data.value;
        let arrayOfCards = await this.appStorageService.get('my-cards');
        const cardIndex = arrayOfCards.findIndex((v: { id: number; }) => v.id === data.value.id);
        arrayOfCards[cardIndex] = data.value;
        arrayOfCards = Object.assign([], arrayOfCards);
        this.cards = arrayOfCards;
        await this.appStorageService.set('my-cards', arrayOfCards);
      }
    console.log('editCard function from details-card-view.page.ts');
  }

  async removeCard() {
    console.log('removeCard function from details-card-view.page.ts');
    const arrayOfCards = await this.appStorageService.get('my-cards');
    const val: Card = arrayOfCards.find((v: { id: number; }) => v.id === this.card.id);
    this.cards = arrayOfCards.filter((e: any) => e != val);
    await this.appStorageService.set('my-cards', this.cards);
    return this.dialogService.dismissModal(this.cards, 'delete');
  };


  back() {
    return this.dialogService.dismissModal(this.cards, 'back');
  }

}
