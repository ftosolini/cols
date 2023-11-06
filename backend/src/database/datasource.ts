import { ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import { validationSchema } from 'config/validation'
import configuration from 'config/configuration'

const { parsed: envConfig } = config({ path: `src/config/env/${process.env.NODE_ENV}.env` })
const validConfig = validationSchema.validate(envConfig)
process.env = { ...process.env, ...validConfig.value }
const configService = new ConfigService(configuration())

export default new DataSource({
    type: 'mariadb',
    host: configService.get('database.host'),
    port: +configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.name'),
    entities: ['src/**/*.entity.ts'],
    migrations: ['migrations/*.ts'],
    synchronize: false,
})
