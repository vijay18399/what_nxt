import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OcrPage } from './ocr.page';

const routes: Routes = [
  {
    path: '',
    component: OcrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OcrPageRoutingModule {}
