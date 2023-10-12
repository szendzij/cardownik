import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


export interface Card {
  id: number,
  shopName: string,
  shopLocalization: string,
  modified: number
}

const CARD_KEY = 'my_cards';


@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  private _storage: Storage | null = null;


  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }


  public async set(key: string, value: any) {
    let result = await this._storage?.set(key, value);
    console.log(result)
  }

  public async get(key: string) {
    let value = await this._storage?.get(key);
    console.log(value);
    return value;
  }

  public async remove(key: string) {
    let value = await this._storage?.remove(key);
    console.log(value);
    return value;
  }

  public async clear() {
    await this._storage?.clear()
  }

  public async keys(key: string) {
    let value = await this._storage?.keys();
    console.log(value);
    return value;
  }

}
