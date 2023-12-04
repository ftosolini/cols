import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { ClientEntity } from 'client/entities/client.entity'
import { ClientService } from 'client/services/client.service'
import { ConfigModule } from 'config/config.module'
import { TestDatabaseModule } from 'database/test-database.module'
import { Repository } from 'typeorm'

describe('ClientService', () => {
    let repository: Repository<ClientEntity>
    let service: ClientService
    let module: TestingModule

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule,
                TestDatabaseModule.forFeature([ClientEntity]),
                TypeOrmModule.forFeature([ClientEntity]),
            ],
            providers: [
                {
                    provide: getRepositoryToken(ClientEntity),
                    useClass: Repository,
                },
            ],
        }).compile()
        repository = module.get<Repository<ClientEntity>>(getRepositoryToken(ClientEntity))
        service = new ClientService(repository)
    })

    beforeEach(async () => {
        await repository.clear()
    })

    afterAll(async () => {
        await module.close()
    })

    describe('create', () => {
        it('should create a client', async () => {
            const input: Partial<ClientEntity> = {
                name: 'test',
                subdomain: 'test',
            }
            const client = await service.create(input)
            expect(client).toHaveProperty('id')
            expect(client.name).toBe(input.name)
            expect(client.subdomain).toBe(input.subdomain)
        })
    })

    describe('getById', () => {
        test('should return a client when id is given', async () => {
            const client = await service.create({
                name: 'test',
                subdomain: 'test',
            })
            const found = await service.getById(client.id)
            expect(found).toEqual(client)
        })

        test('should return null when id is not found', async () => {
            const found = await service.getById('not-found')
            expect(found).toBeNull()
        })
    })

    describe('getBySubdomain', () => {
        test('should return a client when subdomain is given', async () => {
            const client = await service.create({
                name: 'test',
                subdomain: 'test',
            })
            const found = await service.getBySubdomain(client.subdomain)
            expect(found).toEqual(client)
        })

        test('should return null when subdomain is not found', async () => {
            const found = await service.getBySubdomain('not-found')
            expect(found).toBeNull()
        })
    })

    describe('update', () => {
        test('should update when proper id is provided', async () => {
            const client = await service.create({
                name: 'test',
                subdomain: 'test',
            })
            const updated = await service.update(client.id, { name: 'updated' })
            expect(updated.name).toBe('updated')
        })
    })

    describe('delete', () => {
        test('should delete a client when id is given', async () => {
            const client = await service.create({
                name: 'test',
                subdomain: 'test',
            })
            await service.delete(client.id)
            const found = await service.getById(client.id)
            expect(found).toBeNull()
        })
    })
})
