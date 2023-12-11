import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from 'config/config.module'
import { MapController } from 'map/controllers/map.controller'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'

@Module({
    imports: [TypeOrmModule.forFeature([Feature]), ConfigModule],
    providers: [FeatureService],
    controllers: [MapController],
})
export class MapModule {}
