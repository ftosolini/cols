import { ConsoleLogger, Injectable } from '@nestjs/common'
import { createLogger, format, transports } from 'winston'
import { ConfigService } from '@nestjs/config'
import 'winston-daily-rotate-file'

@Injectable()
export class LoggerService extends ConsoleLogger {
    private readonly logger

    constructor(private configService: ConfigService) {
        super()
        const transportList = []

        const rotateTransport = new transports.DailyRotateFile(this.configService.get('logs'))
        transportList.push(rotateTransport)
        if (this.configService.get('env') === 'dev') {
            transportList.push(
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.prettyPrint(),
                        format.simple()
                    ),
                })
            )
        }
        this.logger = createLogger({
            transports: transportList,
        })
    }

    override log(message: string) {
        this.logger.info(message)
    }

    override error(message: string) {
        this.logger.error(message)
    }

    override warn(message: string) {
        this.logger.warn(message)
    }

    override debug(message: string) {
        this.logger.debug(message)
    }

    override verbose(message: string) {
        this.logger.verbose(message)
    }
}
