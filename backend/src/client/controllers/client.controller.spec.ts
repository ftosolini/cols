import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ClientController } from 'client/controllers/client.controller'
import { ClientEntity } from 'client/entities/client.entity'
import { ClientService } from 'client/services/client.service'
import { ConfigModule } from 'config/config.module'
import request from 'supertest'

describe('ClientController', () => {
    let app: INestApplication
    let service: ClientService

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            controllers: [ClientController],
            providers: [
                ClientService,
                {
                    provide: getRepositoryToken(ClientEntity),
                    useClass: jest.fn(),
                },
            ],
        }).compile()

        service = module.get<ClientService>(ClientService)
        app = module.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('GET /client/:subdomain', () => {
        test('should return a client when subdomain is given', () => {
            const client = {
                id: 'test',
                name: 'test',
                subdomain: 'test',
            } as ClientEntity
            jest.spyOn(service, 'getBySubdomain').mockResolvedValue(client)
            return request(app.getHttpServer()).get('/client/test').expect(200).expect(client)
        })

        test('should redirect when client is not found', () => {
            jest.spyOn(service, 'getBySubdomain').mockResolvedValue(null)
            return request(app.getHttpServer())
                .get('/client/test')
                .expect(302)
                .expect('Location', 'http://test.com')
        })
    })
})
