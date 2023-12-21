import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { BehaviorSubject, of } from 'rxjs'
import { Col } from 'src/app/map/components/col'
import { Feature, GeoJson } from 'src/app/map/components/geojson.model'

import { MapComponent } from 'src/app/map/components/map/map.component'
import { MapService } from 'src/app/map/map.service'
import { SharedModule } from 'src/app/shared/shared.module'

const geoJson: GeoJson<Col> = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [1.99301, 42.73355],
            },
            properties: {
                name: 'Port de Pailhères',
                altitude: 2001,
                climbs: [
                    {
                        done: true,
                        start: 'Mijanes',
                        length: 10.6,
                        moyen: 8.22,
                        max: 10.2,
                        profil: 'https://profils.cols-cyclisme.com/323.svg',
                        category: 0,
                    },
                    {
                        done: false,
                        start: 'Ax les Thermes',
                        length: 18.6,
                        moyen: 6.89,
                        max: 10.4,
                        profil: 'https://profils.cols-cyclisme.com/324.svg',
                        category: 0,
                    },
                ],
            },
        },
    ],
}
const queryParamsStub = new BehaviorSubject<Params>({})
const activatedRouteStub = { queryParams: queryParamsStub }

describe('MapComponent', () => {
    let component: MapComponent
    let fixture: ComponentFixture<MapComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MapComponent],
            imports: [
                SharedModule,
                MatIconModule,
                NoopAnimationsModule,
                RouterTestingModule,
                HttpClientTestingModule,
            ],
            providers: [
                {
                    provide: MapService,
                    useValue: {
                        loadFeatures: () => of(geoJson),
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: activatedRouteStub,
                },
                Router,
            ],
        })
        fixture = TestBed.createComponent(MapComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    test('should initialize the map', () => {
        expect(component.map).toBeDefined()
        expect(component.map?.getCenter()).toEqual({ lat: 46.469524, lng: 2.433 })
        expect(component.map?.getZoom()).toEqual(6)
    })

    describe('query params subscription', () => {
        test('should update the map when the query params lat and lng exists', () => {
            const spy = jest.spyOn(component.map!, 'setView')
            component.ngOnInit()

            expect(spy).toHaveBeenCalledTimes(0)
            queryParamsStub.next({ lat: 1, lng: 2 })
            expect(spy).toHaveBeenCalledWith([1, 2], 10)
        })

        test('should not update the map when the query params lat and lng do not exist', () => {
            const spy = jest.spyOn(component.map!, 'setView')

            expect(spy).toHaveBeenCalledTimes(0)
            queryParamsStub.next({})
            expect(spy).toHaveBeenCalledTimes(0)
        })

        test('should not update the map when the query params lat exists but not lng', () => {
            const spy = jest.spyOn(component.map!, 'setView')

            expect(spy).toHaveBeenCalledTimes(0)
            queryParamsStub.next({ lat: 1 })
            expect(spy).toHaveBeenCalledTimes(0)
        })

        test('should not update the map when the query params lng exists but not lat', () => {
            const spy = jest.spyOn(component.map!, 'setView')

            expect(spy).toHaveBeenCalledTimes(0)
            queryParamsStub.next({ lng: 1 })
            expect(spy).toHaveBeenCalledTimes(0)
        })
    })

    // test('should handle the click event', async () => {
    //     const mockLayer = L.geoJson() // Create a mock geoJson layer

    // Mock the necessary methods and properties
    // const event = {
    //     propagatedFrom: {
    //         feature: 'your-mocked-feature', // Replace with your mocked feature
    //     },
    // }

    // Call the handleGeoJsonClick function with the mock layer and map
    // component.handleGeoJsonClick(mockLayer)

    // Trigger the 'click' event on the mock layer
    // mockLayer.fire('click', event)

    // Assert the expected behavior, e.g., check if toggleRightPanel was called
    // expect(toggleRightPanelSpy).toHaveBeenCalledWith(true)
    // })

    describe('getColColor', () => {
        test('should return green when all climbs are done', () => {
            const feature = {
                properties: {
                    climbs: [{ done: true }, { done: true }, { done: true }],
                },
            }
            expect(component.getColColor(feature as Feature<Col>)).toBe('green')
        })

        test('should return yellow when some climbs are done', () => {
            const feature = {
                properties: {
                    climbs: [{ done: true }, { done: false }, { done: false }],
                },
            }
            expect(component.getColColor(feature as Feature<Col>)).toBe('yellow')
        })

        test('should return red when no climbs are done', () => {
            const feature = {
                properties: {
                    climbs: [{ done: false }, { done: false }, { done: false }],
                },
            }
            expect(component.getColColor(feature as Feature<Col>)).toBe('red')
        })
    })
})
