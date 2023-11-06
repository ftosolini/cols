import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { LoggerService } from 'logger/logger.service'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private logger: LoggerService) {}
    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl } = request
        const userAgent = request.get('user-agent') || ''

        response.on('finish', () => {
            const { statusCode } = response
            const contentLength = response.get('content-length')

            const message = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`

            if (statusCode >= 500) {
                this.logger.error(message)
            } else if (statusCode < 500 && statusCode >= 400) {
                this.logger.warn(message)
            } else {
                this.logger.log(message)
            }
        })

        next()
    }
}
