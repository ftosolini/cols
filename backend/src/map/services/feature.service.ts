import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Feature } from 'map/entities/feature.entity'
import { FeatureNotFoundError } from 'map/errors/featureNotFound.error'
import { Between, Repository } from 'typeorm'

@Injectable()
export class FeatureService {
    constructor(
        @InjectRepository(Feature) private readonly featureRepository: Repository<Feature>
    ) {}

    /**
     * Create a feature
     * @param data
     */
    create(data: Partial<Feature>): Promise<Feature> {
        return this.featureRepository.save(data)
    }

    /**
     * create many features
     * @param data features to add
     */
    createMany(data: Partial<Feature>[]): Promise<Feature[]> {
        return this.featureRepository.save(data)
    }

    /**
     * Update a feature
     * @param id
     * @param clientId
     * @param data
     */
    async update(id: string, clientId: string, data: Partial<Feature>): Promise<Feature> {
        const feature = await this.findById(id, clientId)
        if (!feature) throw new FeatureNotFoundError(id)
        return await this.featureRepository.save({ ...feature, ...data, id, clientId })
    }

    /**
     * @param clientId the client id
     * Find all features from a client
     */
    findAll(clientId: string): Promise<Feature[]> {
        return this.featureRepository.find({ where: { clientId } })
    }

    /**
     * Find a feature by id
     * @param id
     * @param clientId
     */
    findById(id: string, clientId?: string): Promise<Feature | null> {
        return this.featureRepository.findOneBy({ id, clientId })
    }

    /**
     * Find features in a rectangle
     * @param minLatitude
     * @param minLongitude
     * @param maxLatitude
     * @param maxLongitude
     * @param clientId
     */
    findByRect(
        minLatitude: number,
        minLongitude: number,
        maxLatitude: number,
        maxLongitude: number,
        clientId?: string
    ): Promise<Feature[]> {
        return this.featureRepository.find({
            where: {
                latitude: Between(minLatitude, maxLatitude),
                longitude: Between(minLongitude, maxLongitude),
                clientId,
            },
        })
    }

    /**
     * Paginate features
     * @param clientId
     * @param offset default 0
     * @param limit default 25
     */
    paginate(clientId: string, offset = 0, limit = 25): Promise<Feature[]> {
        return this.featureRepository.find({
            where: { clientId },
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
