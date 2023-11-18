import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AppModule } from 'app/app.module'
import * as fs from 'fs'
import { LoggerService } from 'logger/logger.service'
import { Feature } from 'map/entities/feature.entity'
import { FeatureService } from 'map/services/feature.service'
import * as path from 'path'

const init = async () => {
    const app = await NestFactory.createApplicationContext(AppModule)
    const configService = app.get(ConfigService)
    const logger = new LoggerService(configService)
    const featureService = app.get(FeatureService)
    logger.log('Starting')

    logger.log('deleting all features')
    await app.get(getRepositoryToken(Feature)).clear()

    logger.log('loading files...')
    const dataDir = path.join(__dirname, '../data')
    logger.log(`dataDir: ${dataDir}`)
    const files = fs.readdirSync(dataDir)
    for (const file of files) {
        logger.log(`loading file: ${file}`)
        const data = fs.readFileSync(`./data/${file}`, 'utf-8')
        const { features } = JSON.parse(data)
        const geoJsonFeatures = features.map(geoJsonToFeature).flat()
        await featureService.createMany(geoJsonFeatures)
        logger.log(`loaded ${geoJsonFeatures.length} features`)
    }
    await app.close()
    logger.log('Done')
}

const geoJsonToFeature = (geoJson: any):Feature[] => {
    let feature = new Feature()
    const {name, climbs, id, ...properties} = geoJson.properties
    const [longitude, latitude ] = geoJson.geometry.coordinates

    return climbs.map((climb: any) => {
        delete climb.done
        let feature = new Feature()
        feature.id = id
        feature.name = name
        feature.latitude = latitude
        feature.longitude = longitude
        feature.properties = {
            ...properties,
            ...climb
        }
        return feature
    })

}

init()
