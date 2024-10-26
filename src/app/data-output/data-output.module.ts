import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { DataOutputComponent } from './components/data-output/data-output.component';
import { TopListComponent } from './components/top-list/top-list.component';
import { TopArtistsComponent } from './components/top-artists/top-artists.component';
import { TopArtistTableComponent } from './components/top-artist-table/top-artist-table.component';
import { NostalgicThrowbacksComponent } from './components/nostalgic-throwbacks/nostalgic-throwbacks.component';
import { TotalTimeComponent } from './components/total-time/total-time.component';

const routes: Routes = [
  { path: '', component: DataOutputComponent },
];

@NgModule({
  declarations: [
    DataOutputComponent,
    TopListComponent,
    TopArtistTableComponent,
    NostalgicThrowbacksComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TopArtistsComponent,
    TotalTimeComponent
  ],
  exports: []
})
export class DataOutputModule { }
