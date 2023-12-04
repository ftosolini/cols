import { Controller, Get, Param } from '@nestjs/common'
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ClientEntity } from 'client/entities/client.entity'
import { ClientService } from 'client/services/client.service'

@Controller('client')
@ApiTags('Client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get(':subdomain')
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiResponse({ status: 200, description: 'The requested client', type: ClientEntity })
    async getBySubdomain(@Param('subdomain') subdomain: string): Promise<ClientEntity> {
        const client = await this.clientService.getBySubdomain(subdomain)
        if (client) {
            return client
        }
        throw new Error('Not found')
    }
}
