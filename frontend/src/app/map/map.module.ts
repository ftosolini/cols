import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module'
import { MapComponent } from './components/map/map.component';



@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class MapModule { }
