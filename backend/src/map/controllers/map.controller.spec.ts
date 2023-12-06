import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MapController } from 'map/controllers/map.controller'
import { CreateFeatureDto, UpdateFeatureDto } from 'map/dtos/feature.dto'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'
import { v4 } from 'uuid'
import * as GeoJson from 'map/entities/geojson'

describe('MapController', () => {
    let controller: MapController
    let featureService: FeatureService
    const clientId = v4()
    const mockHeaders = {
        'x-client-id': clientId,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MapController],
            providers: [
                FeatureService,
                {
                    provide: getRepositoryToken(Feature),
                    useClass: jest.fn(),
                },
            ],
        }).compile()

        controller = module.get<MapController>(MapController)
        featureService = module.get<FeatureService>(FeatureService)
    })

    describe('createFeature', () => {
        test('should create a feature', async () => {
            const feature: CreateFeatureDto = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            jest.spyOn(featureService, 'create').mockResolvedValue({
                ...feature,
                id: 'uuid',
            } as Feature)
            const createdFeature = await controller.createFeature(feature, mockHeaders)
            expect(createdFeature).toBeDefined()
            expect(createdFeature.id).toBeDefined()
            expect(createdFeature.properties).toEqual(feature.properties)
            expect(createdFeature.latitude).toEqual(feature.latitude)
            expect(createdFeature.longitude).toEqual(feature.longitude)
            expect(createdFeature.name).toEqual(feature.name)
            expect(createdFeature.clientId).toEqual(feature.clientId)
        })
    })

    describe('updateFeature', () => {
        test('should update a feature', async () => {
            const feature: UpdateFeatureDto = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            jest.spyOn(featureService, 'update').mockResolvedValue({
                ...feature,
                id: 'uuid',
            } as Feature)
            const updatedFeature = await controller.updateFeature('uuid', feature, mockHeaders)
            expect(updatedFeature).toBeDefined()
            expect(updatedFeature.id).toBeDefined()
            expect(updatedFeature.properties).toEqual(feature.properties)
            expect(updatedFeature.latitude).toEqual(feature.latitude)
            expect(updatedFeature.longitude).toEqual(feature.longitude)
            expect(updatedFeature.name).toEqual(feature.name)
            expect(updatedFeature.clientId).toEqual(feature.clientId)
        })

        test('should throw an error if feature not found', async () => {
            jest.spyOn(featureService, 'update').mockRejectedValue(new Error('Not found'))
            await expect(
                controller.updateFeature('uuid', {} as UpdateFeatureDto, mockHeaders)
            ).rejects.toThrow('Not found')
        })
    })

    describe('getAllFeatures', () => {
        test('should return an array of features', async () => {
            jest.spyOn(featureService, 'paginate').mockResolvedValue([
                {
                    id: 'uuid',
                    properties: {
                        prop1: 'prop1',
                    },
                    name: 'test',
                    latitude: 0,
                    longitude: 0,
                    clientId,
                } as Feature,
            ])
            const features = await controller.getAllFeatures(mockHeaders, 0, 25)
            expect(features).toBeDefined()
        })
    })

    describe('getFeatureById', () => {
        test('should return a feature', async () => {
            jest.spyOn(featureService, 'findById').mockResolvedValue({
                id: 'uuid',
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            } as Feature)
            const feature = await controller.getFeatureById('uuid', mockHeaders)
            expect(feature).toBeDefined()
        })

        test('should throw an error if feature not found', async () => {
            jest.spyOn(featureService, 'findById').mockResolvedValue(null)
            await expect(controller.getFeatureById('uuid', mockHeaders)).rejects.toThrow(
                'Not found'
            )
        })
    })

    describe('deleteFeature', () => {
        test('should delete a feature', async () => {
            jest.spyOn(featureService, 'delete').mockResolvedValue()
            await expect(controller.deleteFeature('uuid')).resolves.toBeUndefined()
        })
    })

    describe('getFeaturesByRect', () => {
        test('should return geojson feature collection with the features', async () => {
            const features: Feature[] = [
                {
                    id: 'uuid',
                    properties: {
                        prop1: 'prop1',
                    },
                    name: 'test',
                    latitude: 0,
                    longitude: 0,
                    clientId,
                },
            ]
            jest.spyOn(featureService, 'findByRect').mockResolvedValue(features)
            const geojson = await controller.getFeaturesByRect(
                {
                    minLatitude: 0,
                    minLongitude: 0,
                    maxLatitude: 0,
                    maxLongitude: 0,
                },
                mockHeaders
            )
            expect(geojson).toBeDefined()
            expect(geojson.features).toEqual([MapController.featureToGeoJsonFeature(features[0])])
        })

        test('when no features found should return empty geojson feature collection', async () => {
            jest.spyOn(featureService, 'findByRect').mockResolvedValue([])
            const geojson = await controller.getFeaturesByRect(
                {
                    minLatitude: 0,
                    minLongitude: 0,
                    maxLatitude: 0,
                    maxLongitude: 0,
                },
                mockHeaders
            )
            expect(geojson).toEqual(new GeoJson.FeatureCollection([]))

        })
    })
})
