import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { of } from 'rxjs'

import {
    FeatureDataSource,
    ListFeaturesComponent,
} from 'src/app/map/components/list-features/list-features.component'
import { MapService } from 'src/app/map/map.service'

describe('ListFeaturesComponent', () => {
    let component: ListFeaturesComponent
    let fixture: ComponentFixture<ListFeaturesComponent>

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [ListFeaturesComponent],
            imports: [
                MatPaginatorModule,
                MatTableModule,
                RouterTestingModule,
                NoopAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [
                Router,
                {
                    provide: MapService,
                    useValue: {
                        paginateFeatures: () => of({ length: 0, items: [] }),
                    },
                },
            ],
        })

        fixture = TestBed.createComponent(ListFeaturesComponent)
        component = fixture.componentInstance
    })

    test('should create', () => {
        expect(component).toBeTruthy()
        const compiled = fixture.nativeElement
        const table = compiled.querySelector('table')
        const paginator = compiled.querySelector('mat-paginator')
        expect(table).toBeTruthy()
        expect(paginator).toBeTruthy()
    })

    describe('onPageChange', () => {
        test('should update page size and load page', () => {
            const event: PageEvent = { length: 10, pageSize: 10, pageIndex: 1 }
            const loadPageSpy = jest.spyOn(component.dataSource, 'loadPage')
            component.onPageChange(event)
            expect(component.dataSource.pageSize).toEqual(event.pageSize)
            expect(loadPageSpy).toHaveBeenCalledWith(event.pageIndex)
        })
    })

    describe('focusOnFeature', () => {
        test('should navigate to map with lat and lng query params', async () => {
            const router = TestBed.inject(Router)
            const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true)
            await component.focusOnFeature({ latitude: 1, longitude: 2 })
            expect(navigateSpy).toHaveBeenCalledWith(['map'], {
                queryParams: {
                    lat: 1,
                    lng: 2,
                },
            })
        })
    })

    describe('FeatureDataSource', () => {
        test('should set length', () => {
            const dataSource = new FeatureDataSource(TestBed.inject(MapService))
            dataSource.length = 10
            expect(dataSource.length).toEqual(10)
        })

        test('should set pageSize', () => {
            const dataSource = new FeatureDataSource(TestBed.inject(MapService))
            dataSource.pageSize = 10
            expect(dataSource.pageSize).toEqual(10)
        })

        test('should connect', () => {
            const mapService = TestBed.inject(MapService)
            const paginateFeaturesSpy = jest.spyOn(mapService, 'paginateFeatures')
            const dataSource = new FeatureDataSource(mapService)
            const stream = dataSource.connect()
            expect(stream).toBeDefined()
            expect(paginateFeaturesSpy).toHaveBeenCalledWith(0, 20)
        })

        test('should disconnect', () => {
            const dataSource = new FeatureDataSource(TestBed.inject(MapService))
            dataSource.disconnect()
            expect(dataSource['subscription'].closed).toBeTruthy()
        })
    })
})
