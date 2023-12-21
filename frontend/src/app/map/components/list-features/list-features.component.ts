import { DataSource } from '@angular/cdk/collections'
import { Component } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { MapService } from 'src/app/map/map.service'

@Component({
    selector: 'app-list-features',
    templateUrl: './list-features.component.html',
    styleUrls: ['./list-features.component.css'],
})
export class ListFeaturesComponent {
    displayedColumns: string[] = ['name', 'actions']
    dataSource: FeatureDataSource

    constructor(
        private mapService: MapService,
        private router: Router
    ) {
        this.dataSource = new FeatureDataSource(this.mapService)
    }

    onPageChange(event: PageEvent) {
        this.dataSource.pageSize = event.pageSize
        this.dataSource.loadPage(event.pageIndex)
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    async focusOnFeature(feature: any) {
        await this.router.navigate(['map'], {
            queryParams: {
                lat: feature.latitude,
                lng: feature.longitude,
            },
        })
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class FeatureDataSource implements DataSource<any> {
    private _pageSize = 20
    private _length: number = 0
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private dataStream: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
    private subscription: Subscription = new Subscription()
    constructor(private mapService: MapService) {}

    get length(): number {
        return this._length
    }

    set length(value: number) {
        this._length = value
    }

    get pageSize(): number {
        return this._pageSize
    }

    set pageSize(value: number) {
        this._pageSize = value
    }

    /** eslint-disable @typescript-eslint/no-explicit-any */
    connect(): Observable<any[]> {
        this.subscription.add(
            this.mapService.paginateFeatures(0, this._pageSize).subscribe((pagination) => {
                this._length = pagination.count
                this.dataStream.next(pagination.items)
            })
        )

        return this.dataStream
    }

    disconnect(): void {
        this.subscription.unsubscribe()
    }

    loadPage(page: number) {
        this.mapService
            .paginateFeatures(page * this._pageSize, this._pageSize)
            .subscribe((pagination) => {
                this._length = pagination.count
                this.dataStream.next(pagination.items)
            })
    }
}
