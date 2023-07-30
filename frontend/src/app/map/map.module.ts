import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MapService } from 'src/app/map/map.service'
import { SharedModule } from 'src/app/shared/shared.module'
import { MapComponent } from './components/map/map.component';
import { FeatureInfoComponent } from './components/feature-info/feature-info.component';



@NgModule({
  declarations: [
    MapComponent,
    FeatureInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [MapService]
})
export class MapModule { }
