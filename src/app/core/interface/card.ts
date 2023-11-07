export interface Card {
  [x: string]: any;
  id?: number,
  cardName: string,
  barcode: string;
  objectLocalization: {
    loc: string,
    lat: number,
    lng: number
  },
  modified: string
}
