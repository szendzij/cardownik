import {Barcode} from "@capacitor-mlkit/barcode-scanning";

export interface Card {
    id: number,
    shopName: string,
    barcode: Barcode;
    shopLocalization: string,
    modified: string
}
