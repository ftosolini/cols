import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'
import { Repository } from 'typeorm'

describe('featureService', () => {
    let featureService: FeatureService
    let featureRepository: Repository<Feature>

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                FeatureService,
                {
                    provide: getRepositoryToken(Feature),
                    useClass: Repository,
                },
            ],
        }).compile()

        featureService = moduleRef.get<FeatureService>(FeatureService)
        featureRepository = moduleRef.get<Repository<Feature>>(getRepositoryToken(Feature))
    })

    describe('create', () => {
        it('should create a feature', async () => {
            const feature = {
                id: '1',
                latitude: 12,
                longitude: 230,
                name: 'Test Feature',
                properties: {},
            }
            jest.spyOn(featureRepository, 'save').mockResolvedValue(feature)

            expect(await featureService.create(feature)).toEqual(feature)
        })

        it('should create a feature with a default properties value', async () => {
            const feature = {
                id: '1',
                latitude: 12,
                longitude: 230,
                name: 'Test Feature',
            }
            jest.spyOn(featureRepository, 'save').mockResolvedValue({...feature, properties: {}})

            expect(await featureService.create(feature)).toEqual({...feature, properties: {}})
        })
    })

    describe('update', () => {
        it('should update a feature', async () => {
            const feature = {
                id: '1',
                latitude: 12,
                longitude: 230,
                name: 'Test Feature',
                properties: {},
            }
            jest.spyOn(featureRepository, 'save').mockResolvedValue(feature)

            expect(await featureService.update('1', feature)).toEqual(feature)
        })
    })

    describe('findAll', () => {
        it('should return an array of features', async () => {
            const features = [
                { id: '1', latitude: 12, longitude: 230, name: 'Test Feature 1', properties: {} },
                { id: '2', latitude: 132, longitude: 23, name: 'Test Feature 2', properties: {} },
            ]
            jest.spyOn(featureRepository, 'find').mockResolvedValue(features)

            expect(await featureService.findAll()).toEqual(features)
        })
    })

    describe('findById', () => {
        it('should return a feature', async () => {
            const feature = {
                id: '1',
                latitude: 12,
                longitude: 230,
                name: 'Test Feature',
                properties: {},
            }
            jest.spyOn(featureRepository, 'findOneBy').mockResolvedValue(feature)

            expect(await featureService.findById('1')).toEqual(feature)
        })

        it('should return null if feature is not found', async () => {
            jest.spyOn(featureRepository, 'findOneBy').mockResolvedValue(null)

            expect(await featureService.findById('1')).toBeNull()
        })
    })

    describe('findByRect', () => {
        it('should return an array of features', async () => {
            const features = [
                { id: '1', latitude: 12, longitude: 230, name: 'Test Feature 1', properties: {} },
                { id: '2', latitude: 132, longitude: 23, name: 'Test Feature 2', properties: {} },
            ]
            jest.spyOn(featureRepository, 'find').mockResolvedValue(features)

            expect(await featureService.findByRect(5, 5, 300, 300)).toEqual(features)
        })

        it('should return an empty array if no features are found', async () => {
            jest.spyOn(featureRepository, 'find').mockResolvedValue([])

            expect(await featureService.findByRect(5, 5, 300, 300)).toEqual([])
        })
    })

    describe('paginate', () => {
        it('should return an array of 5 features', async () => {
            const features = [
                { id: '1', latitude: 12, longitude: 230, name: 'Test Feature 1', properties: {} },
                { id: '2', latitude: 132, longitude: 23, name: 'Test Feature 2', properties: {} },
                { id: '3', latitude: 132, longitude: 23, name: 'Test Feature 3', properties: {} },
                { id: '4', latitude: 132, longitude: 23, name: 'Test Feature 4', properties: {} },
                { id: '5', latitude: 132, longitude: 23, name: 'Test Feature 5', properties: {} },
                { id: '6', latitude: 132, longitude: 23, name: 'Test Feature 6', properties: {} },
            ]
            jest.spyOn(featureRepository, 'find').mockResolvedValue(features.slice(0, 5))
            expect(await featureService.paginate(0, 5)).toEqual(features.slice(0, 5))
        })
        it('if no limit is provided, should return an array of 25 features', async () => {
            const features = Array.from({ length: 30 }, (_, i) => ({
                id: `${i}`,
                latitude: 12 + i,
                longitude: 230 - i,
                name: `Test Feature ${i}`,
                properties: {},
            }))

            jest.spyOn(featureRepository, 'find').mockResolvedValue(features.slice(5, 30))
            expect(await featureService.paginate(5)).toEqual(features.slice(5, 30))
        })

        it('if no offset is provided, should return an array of 25 features', async () => {
            const features = Array.from({ length: 30 }, (_, i) => ({
                id: `${i}`,
                latitude: 12 + i,
                longitude: 230 - i,
                name: `Test Feature ${i}`,
                properties: {},
            }))

            jest.spyOn(featureRepository, 'find').mockResolvedValue(features.slice(0, 25))
            expect(await featureService.paginate()).toEqual(features.slice(0, 25))
        })

        it('should return 5 features from the sixth position', async () => {
            const features = Array.from({ length: 10 }, (_, i) => ({
                id: `${i}`,
                latitude: 12 + i,
                longitude: 230 - i,
                name: `Test Feature ${i}`,
                properties: {},
            }))

            jest.spyOn(featureRepository, 'find').mockResolvedValue(features.slice(5, 10))
            expect(await featureService.paginate(5, 5)).toEqual(features.slice(5, 10))
        })
    })

    describe('delete', () => {
        it('should delete a feature', async () => {
            const feature = {
                id: '1',
                latitude: 12,
                longitude: 230,
                name: 'Test Feature',
                properties: {},
            }
            jest.spyOn(featureRepository, 'delete').mockResolvedValue({ raw: feature, affected: 1 })

            expect(await featureService.delete('1')).toBeUndefined()
        })
    })
})
