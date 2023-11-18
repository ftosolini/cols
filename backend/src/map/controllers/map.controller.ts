import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiCreatedResponse, ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateFeatureDto, UpdateFeatureDto } from 'map/dtos/feature.dto'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'

@Controller('map')
@ApiTags('Map')
export class MapController {
    constructor(private featureService: FeatureService) {}
    @Post()
    @ApiCreatedResponse({ description: 'Caps created', type: Feature })
    createFeature(@Body() data: CreateFeatureDto): Promise<Feature> {
        return this.featureService.create(data)
    }

    @Post(':id')
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiResponse({ status: 200, description: 'feature updated', type: Feature })
    updateFeature(@Param('id') id: string, @Body() data: UpdateFeatureDto): Promise<Feature> {
        return this.featureService.update(id, { ...data, id })
    }

    @Get()
    @ApiResponse({ status: 200, description: 'The list of features', type: [Feature] })
    getAllFeatures(@Query('offset') offset?: number, @Query('limit') limit?: number): Promise<Feature[]> {
        return this.featureService.paginate(offset, limit)
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'The requested feature', type: Feature })
    @ApiNotFoundResponse({ description: 'Not found' })
    async getFeatureById(@Param('id') id: string): Promise<Feature> {
        const feature = await this.featureService.findById(id)
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
    @ApiResponse({ status: 200, description: 'The list of features', type: [Feature] })
    getFeaturesByRect(
        @Body()
        data: {
            minLatitude: number
            minLongitude: number
            maxLatitude: number
            maxLongitude: number
        }
    ): Promise<Feature[]> {
        return this.featureService.findByRect(
            data.minLatitude,
            data.minLongitude,
            data.maxLatitude,
            data.maxLongitude
        )
    }
}
