import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import configuration from 'config/configuration'
import { validationSchema } from 'config/validation'

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
            load: [configuration],
            validationSchema,
        }),
    ],
})
export class ConfigModule {}
