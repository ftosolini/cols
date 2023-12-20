import { CollectionViewer, DataSource } from '@angular/cdk/collections'
import { Component, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { Router } from '@angular/router'
import { BehaviorSubject, forkJoin, Observable, of, Subscription, switchMap, tap } from 'rxjs'
import { MapService } from 'src/app/map/map.service'

@Component({
    selector: 'app-list-features',
    templateUrl: './list-features.component.html',
    styleUrl: './list-features.component.css'
})
export class ListFeaturesComponent implements OnInit {
    displayedColumns: string[] = ['name', 'actions']
    dataSource: FeatureDataSource

    constructor(
        private mapService: MapService,
        private router: Router,
    ) {
        this.dataSource = new FeatureDataSource(this.mapService)
    }

    ngOnInit(): void {
    }
    onPageChange(event: PageEvent) {
        this.dataSource.pageSize = event.pageSize
        this.dataSource.loadPage(event.pageIndex)
    }


    async focusOnFeature(feature: any) {
        console.log(feature)
        await this.router.navigateByUrl('/map')
    }
}

export class FeatureDataSource implements DataSource<any> {
    private _pageSize = 20
    private _length: number = 0
    private dataStream: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
    private subscription: Subscription = new Subscription()
    constructor(
        private mapService: MapService,
    ) { }

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

    connect(): Observable<any[]> {
        this.subscription.add(
            this.mapService.paginateFeatures(0, this._pageSize).subscribe(pagination => {
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
        this.mapService.paginateFeatures(page * this._pageSize, this._pageSize)
            .subscribe( pagination => {
                this._length = pagination.count
                this.dataStream.next( pagination.items )
            })
    }
}
