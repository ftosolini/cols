// unit test of the feature service against a real database

import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from 'config/config.module'
import { TestDatabaseModule } from 'database/test-database.module'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'
import { Repository } from 'typeorm'
import { v4 } from 'uuid'

describe('FeatureService', () => {
    let featureRepository: Repository<Feature>
    let featureService: FeatureService
    let module: TestingModule
    const clientId = v4()

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule,
                TestDatabaseModule.forFeature([Feature]),
                TypeOrmModule.forFeature([Feature]),
            ],
            providers: [
                {
                    provide: getRepositoryToken(Feature),
                    useClass: Repository,
                },
            ],
        }).compile()
        featureRepository = module.get<Repository<Feature>>(getRepositoryToken(Feature))
        featureService = new FeatureService(featureRepository)
    })

    beforeEach(async () => {
        await featureRepository.clear()
    })

    afterAll(async () => {
        await module.close()
    })

    describe('create', () => {
        test('should create a feature', async () => {
            const feature: Partial<Feature> = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0.1234,
                longitude: 0.123456789,
                clientId,
            }
            const createdFeature = await featureService.create(feature)
            expect(createdFeature).toBeDefined()
            expect(createdFeature.id).toBeDefined()
            expect(createdFeature.properties).toEqual(feature.properties)
            expect(createdFeature.latitude).toEqual(feature.latitude)
            expect(createdFeature.longitude).toEqual(feature.longitude)
            expect(createdFeature.name).toEqual(feature.name)
            expect(createdFeature.clientId).toEqual(feature.clientId)
            expect(createdFeature.id).toBeDefined()

            const foundFeature = await featureService.findById(createdFeature.id)
            expect(foundFeature).toBeDefined()
        })
    })

    describe('createMany', () => {
        test('should create many features', async () => {
            const features = [
                {
                    properties: {
                        prop1: 'prop1',
                    },
                    name: 'test',
                    latitude: 0,
                    longitude: 0,
                    clientId,
                },
                {
                    properties: {
                        prop1: 'prop1',
                    },
                    name: 'test',
                    latitude: 0,
                    longitude: 0,
                    clientId,
                },
            ]
            const createdFeatures = await featureService.createMany(features)
            expect(createdFeatures).toBeDefined()
            expect(createdFeatures.length).toEqual(features.length)
            createdFeatures.forEach((createdFeature, index) => {
                expect(createdFeature).toBeDefined()
                expect(createdFeature.id).toBeDefined()
                expect(createdFeature.properties).toEqual(features[index].properties)
                expect(createdFeature.latitude).toEqual(features[index].latitude)
                expect(createdFeature.longitude).toEqual(features[index].longitude)
                expect(createdFeature.name).toEqual(features[index].name)
                expect(createdFeature.clientId).toEqual(features[index].clientId)
                expect(createdFeature.id).toBeDefined()
            })

            const foundFeatures = await featureService.findAll(clientId)
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.length).toEqual(features.length)
        })
    })

    describe('upsert', () => {
        test('should update a feature', async () => {
            const feature = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            const createdFeature = await featureService.create(feature)
            const updatedFeature = await featureService.update(createdFeature.id, {
                ...createdFeature,
                name: 'test2',
            })
            expect(updatedFeature).toBeDefined()
            expect(updatedFeature.id).toEqual(createdFeature.id)
            expect(updatedFeature.properties).toEqual(feature.properties)
            expect(updatedFeature.latitude).toEqual(feature.latitude)
            expect(updatedFeature.longitude).toEqual(feature.longitude)
            expect(updatedFeature.name).toEqual('test2')
        })
    })

    describe('findAll', () => {
        test('should find all features', async () => {
            const feature = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            await featureService.create(feature)
            const features = await featureService.findAll(clientId)
            expect(features).toBeDefined()
            expect(features.length).toEqual(1)
        })
    })

    describe('findById', () => {
        test('should find a feature by id', async () => {
            const feature = {
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            const createdFeature = await featureService.create(feature)
            const foundFeature = await featureService.findById(createdFeature.id)
            expect(foundFeature).toBeDefined()
            expect(foundFeature?.id).toEqual(createdFeature.id)
            expect(foundFeature?.latitude).toEqual(feature.latitude)
            expect(foundFeature?.longitude).toEqual(feature.longitude)
            expect(foundFeature?.name).toEqual(feature.name)
        })

        test('should return null if feature not found', async () => {
            const foundFeature = await featureService.findById('notfound')
            expect(foundFeature).toBeNull()
        })
    })

    describe('delete', () => {
        test('should delete a feature', async () => {
            const feature = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
                clientId,
            }
            const createdFeature = await featureService.create(feature)
            await featureService.delete(createdFeature.id)
            const foundFeature = await featureService.findById(createdFeature.id)
            expect(foundFeature).toBeNull()
        })
    })

    describe('findByRect', () => {
        test('should return feature fitting the rectangle', async () => {
            const features = [
                {
                    name: 'test',
                    latitude: 0,
                    longitude: 0,
                    clientId,
                },
                {
                    name: 'test',
                    latitude: 1,
                    longitude: 1,
                    clientId,
                },
                {
                    name: 'test',
                    latitude: 2,
                    longitude: 2,
                    clientId,
                },
            ]

            await Promise.all(features.map((feature) => featureService.create(feature)))
            const foundFeatures = await featureService.findByRect(0, 0, 1, 1)
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.length).toEqual(2)
            foundFeatures.forEach((feature) => {
                expect(feature.latitude).toBeGreaterThanOrEqual(0)
                expect(feature.latitude).toBeLessThanOrEqual(1)
                expect(feature.longitude).toBeGreaterThanOrEqual(0)
                expect(feature.longitude).toBeLessThanOrEqual(1)
            })
        })
    })

    describe('paginate', () => {
        const features = [
            {
                name: 'Paris',
                latitude: 0,
                longitude: 0,
                clientId,
            },
            {
                name: 'Lyon',
                latitude: 1,
                longitude: 1,
                clientId,
            },
            {
                name: 'Toulouse',
                latitude: 2,
                longitude: 2,
                clientId,
            },
            {
                name: 'Grenoble',
                latitude: 2,
                longitude: 2,
                clientId,
            },
            {
                name: 'Bordeaux',
                latitude: 2,
                longitude: 2,
                clientId,
            },
            {
                name: 'Tours',
                latitude: 2,
                longitude: 2,
                clientId,
            },
        ]
        beforeEach(async () => {
            await Promise.all(features.map((feature) => featureService.create(feature)))
        })

        test('should paginate features', async () => {
            const foundFeatures = await featureService.paginate(clientId, 1, 2)
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.items.length).toEqual(2)
            expect(foundFeatures.items.map((feature) => feature.name)).toEqual(
                features
                    .map((feature) => feature.name)
                    .sort(function (a, b) {
                        if (a > b) {
                            return 1
                        }
                        if (b > a) {
                            return -1
                        }
                        return 0
                    })
                    .slice(1, 3)
            )
            expect(foundFeatures.count).toEqual(features.length)
        })

        test('should paginate features with default values', async () => {
            const foundFeatures = await featureService.paginate(clientId)
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.items.length).toEqual(Math.min(25, features.length))
            expect(foundFeatures.items.map((feature) => feature.name)).toEqual(
                features
                    .map((feature) => feature.name)
                    .sort(function (a, b) {
                        if (a > b) {
                            return 1
                        }
                        if (b > a) {
                            return -1
                        }
                        return 0
                    })
                    .slice(0, Math.min(25, features.length))
            )
            expect(foundFeatures.count).toEqual(features.length)
        })

        test('should return the second page of features', async () => {
            const foundFeatures = await featureService.paginate(clientId, 2, 2)
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.items.length).toEqual(2)
            expect(foundFeatures.items.map((feature) => feature.name)).toEqual(
                features
                    .map((feature) => feature.name)
                    .sort(function (a, b) {
                        if (a > b) {
                            return 1
                        }
                        if (b > a) {
                            return -1
                        }
                        return 0
                    })
                    .slice(2, 4)
            )
            expect(foundFeatures.count).toEqual(features.length)
        })
    })
})
