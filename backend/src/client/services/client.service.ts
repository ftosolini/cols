import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientEntity } from 'client/entities/client.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientEntity) private readonly clientRepository: Repository<ClientEntity>
    ) {}

    /**
     * Create a client
     * @param data
     */
    create(data: Partial<ClientEntity>): Promise<ClientEntity> {
        return this.clientRepository.save(data)
    }

    /**
     * get client by id
     * @param id
     */
    getById(id: string): Promise<ClientEntity | null> {
        return this.clientRepository.findOne({ where: { id } })
    }

    /**
     * get client by subdomain
     * @param subdomain
     */
    getBySubdomain(subdomain: string): Promise<ClientEntity | null> {
        return this.clientRepository.findOne({ where: { subdomain } })
    }

    /**
     * update client
     * @param id
     * @param data
     */
    update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity> {
        return this.clientRepository.save({ ...data, id })
    }

    /**
     * delete client
     * @param id
     */
    async delete(id: string): Promise<void> {
        await this.clientRepository.delete(id)
    }
}
