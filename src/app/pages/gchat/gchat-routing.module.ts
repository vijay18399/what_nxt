import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GchatPage } from './gchat.page';

const routes: Routes = [
  {
    path: '',
    component: GchatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GchatPageRoutingModule {}
