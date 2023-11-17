// unit test of the feature service against a real database

import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from 'config/config.module'
import { TestDatabaseModule } from 'database/test-database.module'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'
import { Repository } from 'typeorm'

describe('FeatureService', () => {
    let featureRepository: Repository<Feature>
    let featureService: FeatureService
    let module: TestingModule

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
        it('should create a feature', async () => {
            const feature = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
            }
            const createdFeature = await featureService.create(feature)
            expect(createdFeature).toBeDefined()
            expect(createdFeature.id).toBeDefined()
            expect(createdFeature.properties).toEqual(feature.properties)
            expect(createdFeature.latitude).toEqual(feature.latitude)
            expect(createdFeature.longitude).toEqual(feature.longitude)
            expect(createdFeature.name).toEqual(feature.name)
            expect(createdFeature.id).toBeDefined()
        })
    })

    describe('update', () => {
        it('should update a feature', async () => {
            const feature = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
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
        it('should find all features', async () => {
            const feature = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
            }
            await featureService.create(feature)
            const features = await featureService.findAll()
            expect(features).toBeDefined()
            expect(features.length).toEqual(1)
        })
    })

    describe('findById', () => {
        it('should find a feature by id', async () => {
            const feature = {
                name: 'test',
                latitude: 0,
                longitude: 0,
            }
            const createdFeature = await featureService.create(feature)
            const foundFeature = await featureService.findById(createdFeature.id)
            expect(foundFeature).toBeDefined()
            expect(foundFeature?.id).toEqual(createdFeature.id)
            expect(foundFeature?.latitude).toEqual(feature.latitude)
            expect(foundFeature?.longitude).toEqual(feature.longitude)
            expect(foundFeature?.name).toEqual(feature.name)
        })

        it('should return null if feature not found', async () => {
            const foundFeature = await featureService.findById('notfound')
            expect(foundFeature).toBeNull()
        })
    })

    describe('delete', () => {
        it('should delete a feature', async () => {
            const feature = {
                properties: {
                    prop1: 'prop1',
                },
                name: 'test',
                latitude: 0,
                longitude: 0,
            }
            const createdFeature = await featureService.create(feature)
            await featureService.delete(createdFeature.id)
            const foundFeature = await featureService.findById(createdFeature.id)
            expect(foundFeature).toBeNull()
        })
    })

    describe('findByRect', () => {
        it('should return feature fitting the rectangle', async () => {
            const features = [
                {
                    name: 'test',
                    latitude: 0,
                    longitude: 0,
                },
                {
                    name: 'test',
                    latitude: 1,
                    longitude: 1,
                },
                {
                    name: 'test',
                    latitude: 2,
                    longitude: 2,
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
            },
            {
                name: 'Lyon',
                latitude: 1,
                longitude: 1,
            },
            {
                name: 'Toulouse',
                latitude: 2,
                longitude: 2,
            },
            {
                name: 'Grenoble',
                latitude: 2,
                longitude: 2,
            },
            {
                name: 'Bordeaux',
                latitude: 2,
                longitude: 2,
            },
            {
                name: 'Tours',
                latitude: 2,
                longitude: 2,
            },
        ]
        beforeEach(async () => {
            await Promise.all(features.map((feature) => featureService.create(feature)))
        })

        it('should paginate features', async () => {
            const foundFeatures = await featureService.paginate(1, 2)
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.length).toEqual(2)
            expect(foundFeatures.map((feature) => feature.name)).toEqual(
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
        })

        it('should paginate features with default values', async () => {
            const foundFeatures = await featureService.paginate()
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.length).toEqual(Math.min(25, features.length))
            expect(foundFeatures.map((feature) => feature.name)).toEqual(
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
        })

        it('should return the second page of features', async () => {
            const foundFeatures = await featureService.paginate(2, 2)
            expect(foundFeatures).toBeDefined()
            expect(foundFeatures.length).toEqual(2)
            expect(foundFeatures.map((feature) => feature.name)).toEqual(
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
        })
    })
})
