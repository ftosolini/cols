import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({})
export class TestDatabaseModule {
    static forFeature(entities: any[]): DynamicModule {
        return {
            module: TestDatabaseModule,
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
                        entities: [...entities],
                        synchronize: true,
                        dropSchema: true,
                        migrationsRun: true,
                        migrations: ['<root-dir>/database/migrations/*.[js, ts]'],
                    }),
                }),
            ],
        }
    }
}
