import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { MapController } from 'map/controllers/map.controller'
import { CreateFeatureDto, UpdateFeatureDto } from 'map/dtos/feature.dto'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'
import request from 'supertest'
import { v4 } from 'uuid'

describe('MapController', () => {
    let app: INestApplication
    let featureService: FeatureService
    const clientId = v4()

    beforeAll(async () => {
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

        featureService = module.get<FeatureService>(FeatureService)

        app = module.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /map', () => {
        test('should create a feature', () => {
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
            return request(app.getHttpServer())
                .post('/map')
                .set('x-client-id', clientId)
                .send(feature)
                .expect(201)
                .expect({
                    ...feature,
                    id: 'uuid',
                })
        })

        test('should throw an error if clientId is missing', () => {
            const feature: CreateFeatureDto = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            return request(app.getHttpServer()).post('/map').send(feature).expect(400)
        })
    })

    describe('POST /map/:id', () => {
        test('should update a feature', () => {
            const feature: UpdateFeatureDto = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            jest.spyOn(featureService, 'findById').mockResolvedValue({
                ...feature,
                id: 'uuid',
            } as Feature)
            jest.spyOn(featureService, 'update').mockResolvedValue({
                ...feature,
                id: 'uuid',
            } as Feature)
            return request(app.getHttpServer())
                .post('/map/uuid')
                .set('x-client-id', clientId)
                .send(feature)
                .expect(200)
                .expect({
                    ...feature,
                    id: 'uuid',
                })
        })

        test('should throw an error if feature not found', () => {
            jest.spyOn(featureService, 'findById').mockResolvedValue(null)
            return request(app.getHttpServer())
                .post('/map/uuid')
                .set('x-client-id', clientId)
                .send({})
                .expect(404)
        })

        test('should throw an error if clientId is missing', async () => {
            return request(app.getHttpServer()).post('/map/uuid').send({}).expect(400)
        })
    })

    describe('GET /map', () => {
        test('should return an array of features', () => {
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
            jest.spyOn(featureService, 'paginate').mockResolvedValue({ items: features, count: 2 })
            return request(app.getHttpServer())
                .get('/map')
                .set('x-client-id', clientId)
                .expect(200)
                .expect({ items: features, count: 2 })
        })

        test('should throw an error if clientId is missing', () => {
            return request(app.getHttpServer()).get('/map').expect(400)
        })
    })

    describe('GET /map/:id', () => {
        test('should return a feature', () => {
            const feature: Feature = {
                id: 'uuid',
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            jest.spyOn(featureService, 'findById').mockResolvedValue(feature)
            return request(app.getHttpServer())
                .get('/map/uuid')
                .set('x-client-id', clientId)
                .expect(200)
                .expect(feature)
        })

        test('should throw an error if feature not found', () => {
            jest.spyOn(featureService, 'findById').mockResolvedValue(null)
            return request(app.getHttpServer())
                .get('/map/uuid')
                .set('x-client-id', clientId)
                .expect(404)
        })

        test('should throw an error if clientId is missing', () => {
            return request(app.getHttpServer()).get('/map/uuid').expect(400)
        })
    })

    describe('DELETE /map/id', () => {
        test('should delete a feature', () => {
            jest.spyOn(featureService, 'delete').mockResolvedValue()
            return request(app.getHttpServer()).delete('/map/uuid').expect(200)
        })
    })

    describe('POST /map/geojson', () => {
        test('should return geojson feature collection with the features', () => {
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
            return request(app.getHttpServer())
                .post('/map/geojson')
                .set('x-client-id', clientId)
                .send({
                    minLatitude: 0,
                    minLongitude: 0,
                    maxLatitude: 0,
                    maxLongitude: 0,
                })
                .expect(200)
                .expect({
                    type: 'FeatureCollection',
                    features: [MapController.featureToGeoJsonFeature(features[0])],
                })
        })

        test('when no features found should return empty geojson feature collection', () => {
            jest.spyOn(featureService, 'findByRect').mockResolvedValue([])
            return request(app.getHttpServer())
                .post('/map/geojson')
                .set('x-client-id', clientId)
                .send({
                    minLatitude: 0,
                    minLongitude: 0,
                    maxLatitude: 0,
                    maxLongitude: 0,
                })
                .expect(200)
                .expect({
                    type: 'FeatureCollection',
                    features: [],
                })
        })

        test('should throw an error if clientId is missing', () => {
            return request(app.getHttpServer())
                .post('/map/geojson')
                .send({
                    minLatitude: 0,
                    minLongitude: 0,
                    maxLatitude: 0,
                    maxLongitude: 0,
                })
                .expect(400)
        })
    })
})
