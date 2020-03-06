import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StationDetailPageRoutingModule } from './station-detail-routing.module';

import { StationDetailPage } from './station-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StationDetailPageRoutingModule
  ],
  declarations: [StationDetailPage]
})
export class StationDetailPageModule {}
