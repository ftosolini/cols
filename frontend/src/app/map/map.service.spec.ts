import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { MapService } from 'src/app/map/map.service'

describe('MapService', () => {
    let service: MapService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        })
        service = TestBed.inject(MapService)
    })

    test('should be created', () => {
        expect(service).toBeTruthy()
    })

    describe('load features', () => {
        test('should return a GeoJson<Col>', async () => {
            const httpClient = TestBed.inject(HttpClient)
            const mockGeoJson = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: ['1.99301000000000', '42.7335500000000'],
                },
                properties: {
                    name: 'Port de Pailhères',
                    altitude: '2001',
                    climbs: [
                        {
                            done: true,
                            start: 'Mijanes',
                            length: '10.60',
                            moyen: '8.22',
                            max: '10.2',
                            profil: 'https://profils.cols-cyclisme.com/323.svg',
                            category: 0,
                        },
                        {
                            done: false,
                            start: 'Ax les Thermes',
                            length: '18.60',
                            moyen: '6.89',
                            max: '10.4',
                            profil: 'https://profils.cols-cyclisme.com/324.svg',
                            category: 0,
                        },
                        {
                            done: true,
                            start: 'Usson Les Bains',
                            length: '14.90',
                            moyen: '8.1',
                            max: '12.0',
                            profil: 'https://profils.cols-cyclisme.com/325.gif',
                            category: 0,
                        },
                        {
                            done: false,
                            start: 'Lavail',
                            length: '11.49',
                            moyen: '7.78',
                            max: '11.0',
                            profil: 'https://profils.cols-cyclisme.com/2940.gif',
                            category: 0,
                        },
                    ],
                    mountain: 'pyerenees-est',
                },
            }

            const getSpy = jest.spyOn(httpClient, 'get').mockReturnValue(of(mockGeoJson))
            service
                .loadFeatures(0, 0, 0, 0)
                .subscribe((geojson) => {
                    expect(geojson).toEqual(mockGeoJson)
                    expect(getSpy).toHaveBeenCalled()
                })
                .unsubscribe()
        })
    })

    describe('paginate features', () => {
        test('should return a Pagination with default values', async () => {
            const httpClient = TestBed.inject(HttpClient)
            const getSpy = jest
                .spyOn(httpClient, 'get')
                .mockReturnValue(of({ count: 1, items: [] }))
            service
                .paginateFeatures()
                .subscribe((pagination) => {
                    expect(pagination).toEqual({ count: 1, items: [] })
                    expect(getSpy).toHaveBeenCalledWith('/api/map?offset=0&limit=10')
                })
                .unsubscribe()
        })

        test('should return a Pagination with custom values', async () => {
            const httpClient = TestBed.inject(HttpClient)
            const getSpy = jest
                .spyOn(httpClient, 'get')
                .mockReturnValue(of({ count: 1, items: [] }))
            service
                .paginateFeatures(30, 25)
                .subscribe((pagination) => {
                    expect(pagination).toEqual({ count: 1, items: [] })
                    expect(getSpy).toHaveBeenCalledWith('/api/map?offset=30&limit=25')
                })
                .unsubscribe()
        })
    })
})
