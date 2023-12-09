import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AppModule } from 'app/app.module'
import { ClientEntity } from 'client/entities/client.entity'
import { ClientService } from 'client/services/client.service'
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
    const clientService = app.get(ClientService)
    logger.log('Starting')

    logger.log('deleting all data')
    await app.get(getRepositoryToken(ClientEntity)).clear()
    await app.get(getRepositoryToken(Feature)).clear()

    logger.log('creating client')
    const client = await createQrColsClient(clientService)

    logger.log('loading files...')
    const dataDir = path.join(__dirname, '../../data')
    logger.log(`dataDir: ${dataDir}`)
    const files = fs.readdirSync(dataDir)
    for (const file of files) {
        logger.log(`loading file: ${file}`)
        const data = fs.readFileSync(`./data/${file}`, 'utf-8')
        const { features } = JSON.parse(data)
        const geoJsonFeatures = features.map(geoJsonToFeature).flat() as Feature[]
        geoJsonFeatures.forEach((feature) => (feature.clientId = client.id))
        await featureService.createMany(geoJsonFeatures)
        logger.log(`loaded ${geoJsonFeatures.length} features`)
    }
    await app.close()
    logger.log('Done')
}

const createQrColsClient = async (service: ClientService): Promise<ClientEntity> => {
    return await service.create({
        name: 'QrCols',
        subdomain: 'qrcols',
    })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const geoJsonToFeature = (geoJson: any): Feature[] => {
    const { name, climbs, id, ...properties } = geoJson.properties
    const [longitude, latitude] = geoJson.geometry.coordinates

    /* eslint-disable @typescript-eslint/no-explicit-any */
    return climbs.map((climb: any) => {
        delete climb.done
        const feature = new Feature()
        feature.id = id
        feature.name = name
        feature.latitude = latitude
        feature.longitude = longitude
        feature.properties = {
            ...properties,
            ...climb,
        }
        return feature
    })
}

init()
