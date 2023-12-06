import { Body, Controller, Delete, Get, Param, Post, Query, Headers } from '@nestjs/common'
import {
    ApiCreatedResponse,
    ApiHeaders,
    ApiNotFoundResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { CreateFeatureDto, UpdateFeatureDto } from 'map/dtos/feature.dto'
import { Feature } from 'map/entities/feature.entity'
import * as GeoJson from 'map/entities/geojson'
import { FeatureService } from 'map/services/feature.service'

@Controller('map')
@ApiTags('Map')
export class MapController {
    constructor(private featureService: FeatureService) {}
    @Post()
    @ApiCreatedResponse({ description: 'Caps created', type: Feature })
    @ApiHeaders([{ name: 'x-client-id', required: true }])
    /* eslint-disable @typescript-eslint/no-explicit-any */
    createFeature(@Body() data: CreateFeatureDto, @Headers() headers: any): Promise<Feature> {
        data.clientId = headers['x-client-id']
        return this.featureService.create(data)
    }

    @Post(':id')
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiResponse({ status: 200, description: 'feature updated', type: Feature })
    @ApiHeaders([{ name: 'x-client-id', required: true }])
    /* eslint-disable @typescript-eslint/no-explicit-any */
    updateFeature(
        @Param('id') id: string,
        @Body() data: UpdateFeatureDto,
        @Headers() headers: any
    ): Promise<Feature> {
        const clientId = headers['x-client-id']
        return this.featureService.update(id, clientId, { ...data })
    }

    @Get()
    @ApiResponse({ status: 200, description: 'The list of features', type: [Feature] })
    @ApiHeaders([{ name: 'x-client-id', required: true }])
    /* eslint-disable @typescript-eslint/no-explicit-any */
    getAllFeatures(
        @Headers() headers: any,
        @Query('offset') offset?: number,
        @Query('limit') limit?: number
    ): Promise<Feature[]> {
        const clientId = headers['x-client-id']
        return this.featureService.paginate(clientId, offset, limit)
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'The requested feature', type: Feature })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiHeaders([{ name: 'x-client-id', required: true }])
    /* eslint-disable @typescript-eslint/no-explicit-any */
    async getFeatureById(@Param('id') id: string, @Headers() headers: any): Promise<Feature> {
        const clientId = headers['x-client-id']
        const feature = await this.featureService.findById(id, clientId)
        if (feature) {
            return feature
        }
        throw new Error('Not found')
    }

    @Delete(':id')
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiResponse({ status: 200, description: 'feature deleted' })
    deleteFeature(@Param('id') id: string): Promise<void> {
        return this.featureService.delete(id)
    }

    @Post('/rect')
    @ApiResponse({
        status: 200,
        description: 'GeoJson features in the given rectangle',
        type: GeoJson.FeatureCollection,
    })
    @ApiHeaders([{ name: 'x-client-id', required: true }])
    /* eslint-disable @typescript-eslint/no-explicit-any */
    async getFeaturesByRect(
        @Body()
        data: {
            minLatitude: number
            minLongitude: number
            maxLatitude: number
            maxLongitude: number
        },
        @Headers() headers: any
    ): Promise<GeoJson.FeatureCollection> {
        const clientId = headers['x-client-id']
        const dbFeatures = await this.featureService.findByRect(
            data.minLatitude,
            data.minLongitude,
            data.maxLatitude,
            data.maxLongitude,
            clientId
        )
        return new GeoJson.FeatureCollection(
            dbFeatures.map((feature) => MapController.featureToGeoJsonFeature(feature))
        )
    }

    static featureToGeoJsonFeature(feature: Feature): GeoJson.Feature {
        const { longitude, latitude, ...properties } = feature
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
            properties: {
                ...properties,
                id: feature.id,
                name: feature.name,
            },
        }
    }
}
