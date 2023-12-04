import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ClientController } from 'client/controllers/client.controller'
import { ClientEntity } from 'client/entities/client.entity'
import { ClientService } from 'client/services/client.service'

describe('ClientController', () => {
    let controller: ClientController
    let service: ClientService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientController],
            providers: [
                ClientService,
                {
                    provide: getRepositoryToken(ClientEntity),
                    useClass: jest.fn(),
                },
            ],
        }).compile()

        controller = module.get<ClientController>(ClientController)
        service = module.get<ClientService>(ClientService)
    })

    describe('getBySubdomain', () => {
        test('should return a client when subdomain is given', async () => {
            const client = {
                id: 'test',
                name: 'test',
                subdomain: 'test',
            } as ClientEntity
            jest.spyOn(service, 'getBySubdomain').mockResolvedValue(client)
            const found = await controller.getBySubdomain(client.subdomain)
            expect(found).toBeDefined()
            expect(found).toEqual(client)
        })

        test('should throw an error when client is not found', async () => {
            jest.spyOn(service, 'getBySubdomain').mockResolvedValue(null)
            await expect(controller.getBySubdomain('test')).rejects.toThrow('Not found')
        })
    })
})
