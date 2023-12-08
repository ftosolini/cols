import { Controller, Get, Param, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClientEntity } from 'client/entities/client.entity'
import { ClientService } from 'client/services/client.service'
import { Response } from 'express'

@Controller('client')
@ApiTags('Client')
export class ClientController {
    constructor(
        private readonly clientService: ClientService,
        private readonly configService: ConfigService,
    ) {}

    @Get(':subdomain')
    @ApiResponse({ status: 302, description: 'Home url' })
    @ApiResponse({ status: 200, description: 'The requested client', type: ClientEntity })
    async getBySubdomain(
        @Param('subdomain') subdomain: string,
        @Res() res: Response
    ): Promise<void> {
        const client = await this.clientService.getBySubdomain(subdomain)
        if (client) {
            res.send(client)
        } else {
            res.redirect(this.configService.get<string>('app.homeUrl') as string)
        }
    }
}
