import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mariadb',
                host: configService.get('database.host'),
                port: +configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),
                autoLoadEntities: true,
                synchronize: ['test', 'dev'].includes(configService.get<string>('env')!),
            }),
        }),
    ],
})
export class DatabaseModule {
    constructor(private datasource: DataSource) {
        datasource.runMigrations()
    }
}
