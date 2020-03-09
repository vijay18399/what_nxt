import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UselectorPage } from './uselector.page';

const routes: Routes = [
  {
    path: '',
    component: UselectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UselectorPageRoutingModule {}
