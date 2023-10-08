import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapsPage } from './maps.page';

const routes: Routes = [
  {
    path: '',
    component: MapsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsPageRoutingModule { }
