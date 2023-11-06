import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from 'app/app.module'
import { LoggerService } from 'logger/logger.service'
import session from 'express-session'
import passport from 'passport'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {})
    const configService = app.get(ConfigService)

    // TODO set cors option from config
    app.enableCors({
        origin: /https?:\/\/localhost:\d{4}/,
        methods: 'GET,PUT,PATCH,POST,DELETE',
        credentials: true,
    })

    const loggerService = new LoggerService(configService)
    loggerService.log('Server starting...')
    app.useLogger(loggerService)

    const config = new DocumentBuilder()
        .setTitle(configService.get<string>('server.name') as string)
        .setDescription('Mozacpas API description')
        .setVersion(configService.get<string>('server.version') as string)
        .addTag('qrcols')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    app.useGlobalPipes(new ValidationPipe())
    app.enableShutdownHooks()

    app.use(
        session({
            secret: 'session-secret', // TODO use configService
            resave: false,
            saveUninitialized: false,
            rolling: true, // keep session alive
            cookie: {
                maxAge: 30 * 60 * 1000, // session expires in 1hr, refreshed by `rolling: true` option.
                httpOnly: true,
            },
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())

    await app.listen(configService.get<number>('server.port') as number)
    loggerService.log(
        `Server started listening to port: ${configService.get<number>('server.port')}`
    )
}
bootstrap().catch((err) => {
    console.error(err)
    process.exit(1)
})
