import { Injectable } from '@angular/core';

export interface Cards {
  shopName: string;
  date: string;
  id: number;
  barcode: string;
  localization: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor() { }

  public cards: Cards[] = [
    {
      shopName: 'Biedronka',
      barcode: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      localization: "Wrocław, Rogowska 123"
    },
    {
      shopName: 'Leroy Merlin',
      barcode: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      localization: "Wrocław, Kiełczowska 15"
    },
    {
      shopName: 'Lidl',
      barcode: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      localization: "Wrocław, Nowowiejska"
    },
    {
      shopName: 'Pandora',
      barcode: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      localization: "Wrocław, Nowa 15"
    },
    {
      shopName: 'Vistula',
      barcode: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      localization: "Wrocław, Jedności Narodowej 15"
    },
    {
      shopName: 'Castorama',
      barcode: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      localization: "Wrocław, Stara 15"
    },
    {
      shopName: 'Tesco',
      barcode: 'New event: Trip to Vegas',
      date: '9:32 AM',
      id: 0,
      localization: "Wrocław, Kiełbaśnicza 15"
    },

  ];

  public getData(): Cards[] {
    return this.cards;
  }

  public addData(card: any) {
    this.cards.push(card)
  }

  public editData() {

  }

  public deleteData() {

  }

  public getMessageById(id: number): Cards {
    return this.cards[id];
  }
}
