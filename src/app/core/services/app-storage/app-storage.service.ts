import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  private _storage: Storage | null = null;
  private _id: number = 0;

  constructor(private storage: Storage) { }
  async init() {
    this._storage = await this.storage.create();
    if(await this._storage?.get('id') == null) {
        await this._storage.set('id', this._id).then(value => value);
    }
  }

  public async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value).then(value => value);
  }

  public async get(key: string): Promise<any> {
    return this._storage?.get(key).then(value => value || null );
  }
  //
  // public async remove(key: string): Promise<void> {
  //   await this._storage?.remove(key).then(value => value);
  // }
  //
  // public async clear(): Promise<void> {
  //   await this._storage?.clear().then(value => value);
  // }
  //
  // public async keys(): Promise<void> {
  //   await this._storage?.keys().then(value => value);
  // }

}
