import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { DialogService } from '../dialog/dialog.service';
import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { BarcodeScannerWeb } from "@capacitor-mlkit/barcode-scanning/dist/esm/web";

const LOGTAG = '[GlobalErrorHandlerService]';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) { }

  public handleError(error: unknown): void {
    this.handle(error).then(r => r);
  }

  private async handle(error: unknown): Promise<void> {
    try {
      const message = this.getMessageFromUnknownError(error);
      await this.showErrorAlert(message);
    } catch (errorHandlerError) {
      console.error(`${LOGTAG} Internal exception:`, errorHandlerError);
    }
  }

  private getMessageFromUnknownError(error: unknown): string {
    let message = 'Wystąpił niespodziewany błąd aplikacji';
    if (error instanceof Object && 'rejection' in error) {
      error = (error as any).rejection;
    }
    if (error instanceof Error && error.message) {
      message = error.message;
    }
    return message;
  }

  private async showErrorAlert(message: string): Promise<void> {
    const dialogService: DialogService =
      this.injector.get<DialogService>(DialogService);
    await dialogService.showErrorAlert({ message });
  }
}
