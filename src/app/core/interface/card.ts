import {Barcode} from "@capacitor-mlkit/barcode-scanning";

export interface Card {
    id?: number,
    shopName: string,
    barcode: string;
    shopLocalization: string,
    modified: string
}
