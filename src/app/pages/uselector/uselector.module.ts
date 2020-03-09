import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UselectorPageRoutingModule } from './uselector-routing.module';

import { UselectorPage } from './uselector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UselectorPageRoutingModule
  ],
  declarations: [UselectorPage]
})
export class UselectorPageModule {}
