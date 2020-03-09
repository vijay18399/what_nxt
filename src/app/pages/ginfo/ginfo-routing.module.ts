import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GinfoPage } from './ginfo.page';

const routes: Routes = [
  {
    path: '',
    component: GinfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GinfoPageRoutingModule {}
