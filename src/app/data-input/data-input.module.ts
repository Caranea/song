import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileInputComponent } from './components/file-input/file-input/file-input.component';
import { RouterModule, Routes } from '@angular/router';
import { CarouselModule } from 'ngx-carousel-ease';
const routes: Routes = [
  { path: '', component: FileInputComponent },
];

@NgModule({
  declarations: [FileInputComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CarouselModule
  ]
})

export class DataInputModule { }
