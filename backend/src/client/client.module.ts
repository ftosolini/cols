import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientController } from 'client/controllers/client.controller'
import { ClientEntity } from 'client/entities/client.entity'
import { ClientService } from 'client/services/client.service'

@Module({
    imports: [TypeOrmModule.forFeature([ClientEntity])],
    providers: [ClientService],
    controllers: [ClientController],
})
export class ClientModule {}
