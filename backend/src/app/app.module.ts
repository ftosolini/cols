import {
    BeforeApplicationShutdown,
    MiddlewareConsumer,
    Module,
    NestModule,
    OnApplicationShutdown,
} from '@nestjs/common'
import { AppController } from 'app/app.controller'
import { AppService } from 'app/app.service'
import { ConfigModule } from 'config/config.module'
import { DatabaseModule } from 'database/database.module'
import { LoggerMiddleware } from 'logger/logger.middleware'
import { LoggerModule } from 'logger/logger.module'
import { LoggerService } from 'logger/logger.service'

@Module({
    imports: [ConfigModule, DatabaseModule, LoggerModule],
    controllers: [AppController],
    providers: [AppService, LoggerService],
})
export class AppModule implements NestModule, BeforeApplicationShutdown, OnApplicationShutdown {
    constructor(private logger: LoggerService) {}
    beforeApplicationShutdown(_signal?: string | undefined) {
        this.logger.log('Server shutting down...')
    }
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }

    onApplicationShutdown(_signal?: string): void {
        this.logger.log('Server shot down')
    }
}
