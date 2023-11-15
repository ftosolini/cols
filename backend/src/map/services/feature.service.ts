import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Feature } from 'map/entities/feature.entity'
import { Between, Repository } from 'typeorm'

@Injectable()
export class FeatureService {
    constructor(@InjectRepository(Feature) private featureRepository: Repository<Feature>) {}

    /**
     * Create a feature
     * @param data
     */
    create(data: Partial<Feature>): Promise<Feature> {
        return this.featureRepository.save(data)
    }

    /**
     * Update a feature
     * @param id
     * @param data
     */
    update(id: string, data: Partial<Feature>): Promise<Feature> {
        return this.featureRepository.save({ ...data, id })
    }

    /**
     * Find all features
     */
    findAll(): Promise<Feature[]> {
        return this.featureRepository.find()
    }

    /**
     * Find a feature by id
     * @param id
     */
    findById(id: string): Promise<Feature | null> {
        return this.featureRepository.findOneBy({ id })
    }

    /**
     * Find features in a rectangle
     * @param minLatitude
     * @param minLongitude
     * @param maxLatitude
     * @param maxLongitude
     */
    findByRect(
        minLatitude: number,
        minLongitude: number,
        maxLatitude: number,
        maxLongitude: number
    ): Promise<Feature[]> {
        return this.featureRepository.find({
            where: {
                latitude: Between(minLatitude, maxLatitude),
                longitude: Between(minLongitude, maxLongitude),
            },
        })
    }

    /**
     * Paginate features
     * @param offset default 0
     * @param limit default 25
     */
    paginate(offset = 0, limit = 25): Promise<Feature[]> {
        return this.featureRepository.find({
            skip: offset,
            take: limit,
            order: {
                name: 'ASC',
            },
        })
    }

    /**
     * Delete a feature
     * @param id
     */
    async delete(id: string): Promise<void> {
        await this.featureRepository.delete(id)
    }
}
