import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GinfoPageRoutingModule } from './ginfo-routing.module';

import { GinfoPage } from './ginfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GinfoPageRoutingModule
  ],
  declarations: [GinfoPage]
})
export class GinfoPageModule {}
