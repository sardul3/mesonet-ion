import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'stations', pathMatch: 'full' },
  {
    path: 'stations',
    children: [
      {
        path: '',
        loadChildren: () => import('./stations/stations.module').then( m => m.StationsPageModule)
      },
      {
          path: ':stationId',
          loadChildren: () => import('./stations/station-detail/station-detail.module').then( m => m.StationDetailPageModule)
      }
    ]
  },
  {
    path: 'calender',
    loadChildren: () => import('./calender/calender.module').then( m => m.CalenderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
