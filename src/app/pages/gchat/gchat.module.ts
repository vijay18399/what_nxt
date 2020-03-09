import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GchatPageRoutingModule } from './gchat-routing.module';

import { GchatPage } from './gchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GchatPageRoutingModule
  ],
  declarations: [GchatPage]
})
export class GchatPageModule {}
