import {
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { FeatureInfoComponent } from 'src/app/map/components/feature-info/feature-info.component'
import { ListFeaturesComponent } from 'src/app/map/components/list-features/list-features.component'
import { MapComponent } from 'src/app/map/components/map/map.component'
import { MapService } from 'src/app/map/map.service'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
    declarations: [MapComponent, FeatureInfoComponent, ListFeaturesComponent],
    imports: [
        CommonModule,
        SharedModule,
        HttpClientModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        CdkVirtualScrollViewport,
        CdkVirtualForOf,
        CdkFixedSizeVirtualScroll,
    ],
    providers: [MapService],
})
export class MapModule {}
