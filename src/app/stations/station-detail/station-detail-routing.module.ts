import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StationDetailPage } from './station-detail.page';

const routes: Routes = [
  {
    path: '',
    component: StationDetailPage
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationDetailPageRoutingModule {}
