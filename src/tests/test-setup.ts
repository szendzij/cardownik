import { ChangeDetectorRef, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const runOnPushChangeDetection =
  <T>(cf: ComponentFixture<T>): (() => Promise<void>) =>
  async () => {
    const cd: ChangeDetectorRef =
      cf.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef as any);
    cd.detectChanges();
    await cf.whenStable();
  };

export const improveChangeDetection = () => {
  const originalCreate = TestBed.createComponent;
  TestBed.createComponent = <T>(component: Type<T>) => {
    const componentFixture: ComponentFixture<T> = originalCreate(component);
    componentFixture.detectChanges = runOnPushChangeDetection(componentFixture);
    return componentFixture;
  };
};


export const muteIonicReInitializeWarning = () => {
  const originalWarn = console.warn;
  const patchedWarn = (warning: any, ...optionalParams: any[]) => {
    const suppress = `Ionic Angular was already initialized. Make sure IonicModule.forRoot() is just called once.`;
    if (warning === suppress) {
      return;
    }
    originalWarn(warning, ...optionalParams);
  };
  console.warn = patchedWarn;
};
