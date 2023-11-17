import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MapController } from 'map/controllers/map.controller'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'

@Module({
    imports: [TypeOrmModule.forFeature([Feature])],
    providers: [FeatureService],
    controllers: [MapController],
})
export class MapModule {}
