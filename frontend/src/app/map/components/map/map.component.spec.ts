import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RouterTestingModule } from '@angular/router/testing'
import * as L from 'leaflet'
import { of } from 'rxjs'
import { Col } from 'src/app/map/components/col'
import { FeatureInfoComponent } from 'src/app/map/components/feature-info/feature-info.component'
import { Feature, GeoJson } from 'src/app/map/components/geojson.model'
import { MapService } from 'src/app/map/map.service'
import { SharedModule } from 'src/app/shared/shared.module'

import { MapComponent } from 'src/app/map/components/map/map.component'

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

describe('MapComponent', () => {
    let component: MapComponent
    let fixture: ComponentFixture<MapComponent>

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MapComponent, FeatureInfoComponent],
            imports: [SharedModule, MatIconModule, NoopAnimationsModule, RouterTestingModule],
            providers: [
                {
                    provide: MapService,
                    useValue: {
                        loadCols: () => of(geoJson),
                    },
                },
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

    test('should handle the click event', async () => {
        const mockLayer = L.geoJson() // Create a mock geoJson layer

        // Mock the necessary methods and properties
        const event = {
            propagatedFrom: {
                feature: 'your-mocked-feature', // Replace with your mocked feature
            },
        }

        // Mock the layout.toggleRightPanel method
        const toggleRightPanelSpy = jest
            .spyOn(component.layout, 'toggleRightPanel')
            .mockResolvedValue(undefined)

        // Call the handleGeoJsonClick function with the mock layer and map
        component.handleGeoJsonClick(mockLayer)

        // Trigger the 'click' event on the mock layer
        mockLayer.fire('click', event)

        // Assert the expected behavior, e.g., check if toggleRightPanel was called
        expect(toggleRightPanelSpy).toHaveBeenCalledWith(true)
    })

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
