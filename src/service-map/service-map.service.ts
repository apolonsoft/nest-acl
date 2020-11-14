import { Injectable, NotFoundException } from '@nestjs/common'
import {
    TransformedJsonSchema,
    transformSchema,
} from 'src/utils/schema-to-json'
import { makeExecutableSchema } from 'graphql-tools'
import { getRemoteSchema } from 'src/utils/get-schema'
import { ServiceMapEntity } from './service-map.entity'
import { schemaDiff } from 'src/utils/schema-diff'
import { ServiceEntity } from 'src/services/service.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ServiceMapService {
    constructor(
        @InjectRepository(ServiceMapEntity)
        private _serviceMapRepository: Repository<ServiceMapEntity>,
    ) {}

    private async _getSchemaJson(
        service: string,
        url: string,
    ): Promise<TransformedJsonSchema> {
        const schema = await getRemoteSchema(url as string)

        const executableSchema = makeExecutableSchema({ typeDefs: schema })

        return transformSchema(executableSchema, { service, url })
    }

    async addServiceMap(
        service: ServiceEntity,
        autosave = true,
    ): Promise<ServiceMapEntity> {
        const { url } = service
        const schemaJson = await this._getSchemaJson(service.name, url)

        const serviceMap = new ServiceMapEntity()

        serviceMap.queries = schemaJson.queries
        serviceMap.mutations = schemaJson.mutations
        serviceMap.subscriptions = schemaJson.subscriptions
        serviceMap.types = schemaJson.types
        serviceMap.actions = schemaJson.actions
        serviceMap.typeReadActions = schemaJson.typeReadActions

        if (autosave) {
            await serviceMap.save()
        }

        return serviceMap
    }

    async getServiceMapById(id: string): Promise<ServiceMapEntity> {
        const serviceMap = await this._serviceMapRepository.findOne(id)
        if (!serviceMap) {
            throw new NotFoundException(`No any service with ${id} id`)
        }

        return serviceMap
    }

    async updateServiceMap(
        service: ServiceEntity,
        autosave = true,
    ): Promise<ServiceMapEntity> {
        const { id, url } = service

        const schemaJson = await this._getSchemaJson(name, url)
        const serviceMap = await this.getServiceMapById(id)

        const {
            queries,
            mutations,
            subscriptions,
            types,
            actions,
            typeReadActions,
        } = schemaJson

        serviceMap.queries = queries
        serviceMap.mutations = mutations
        serviceMap.subscriptions = subscriptions
        serviceMap.types = types
        serviceMap.actions = actions
        serviceMap.typeReadActions = typeReadActions

        if (autosave) {
            await serviceMap.save()
        }

        return serviceMap
    }

    async checkServiceMap(
        service: ServiceEntity,
    ): Promise<[ServiceMapEntity, TransformedJsonSchema]> {
        const { id, name, url } = service
        const serviceMap = await this.getServiceMapById(id)

        const schemaJson = await this._getSchemaJson(name, url)
        const serviceMapDiff = schemaDiff(serviceMap, schemaJson)

        return [serviceMap, serviceMapDiff]
    }
}
