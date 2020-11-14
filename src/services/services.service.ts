import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ActionsService } from 'src/actions/actions.service'
import { ServiceMapDiffType } from 'src/service-map/graphql/types/service-map-diff.type'
import { ServiceMapEntity } from 'src/service-map/service-map.entity'
import { ServiceMapService } from 'src/service-map/service-map.service'
import { queryBuilderLikeExpression } from 'src/shared/helpers/query-builder-like-expression.helper'
import { IPaginated } from 'src/shared/types/paginated.type'
import {
    BaseEntity,
    FindConditions,
    getConnection,
    In,
    Repository,
} from 'typeorm'
import { CreateServiceDto } from './dtos/create-service.dto'
import { CheckServiceInput } from './graphql/inputs/check-service.input'
import { ServicesInput } from './graphql/inputs/services.input'
import { UpdateServiceInput } from './graphql/inputs/update-service.input'
import { ServiceEntity } from './service.entity'

@Injectable()
export class ServicesService {
    private _logger: Logger = new Logger(ServicesService.name)

    constructor(
        @InjectRepository(ServiceEntity)
        private readonly _servicesRepository: Repository<ServiceEntity>,
        private readonly _serviceMapService: ServiceMapService,
        private readonly _actionsService: ActionsService,
    ) {}

    async getServices(
        input: ServicesInput,
    ): Promise<IPaginated<ServiceEntity>> {
        const { filter: infoFilter, url } = input

        const { infoQuery, filter } = infoFilter

        const { ids, skip, limit } = filter

        const alias = 'service'
        const queryBuilder = this._servicesRepository.createQueryBuilder(alias)

        if (infoQuery != null) {
            const fields: (keyof ServiceEntity)[] = [`name`, `description`]

            const likeExpression = queryBuilderLikeExpression(
                infoQuery,
                alias,
                fields,
            )
            queryBuilder.andWhere(likeExpression)
        }

        const whereCondition: FindConditions<ServiceEntity> = {}
        if (ids != null) {
            whereCondition.id = In(ids)
        }

        if (url != null) {
            whereCondition.url = url
        }

        const [services, count] = await queryBuilder
            .where(whereCondition)
            .skip(skip)
            .limit(limit)
            .getManyAndCount()

        return { nodes: services, count }
    }

    async addService(
        createServiceDto: CreateServiceDto,
    ): Promise<ServiceMapEntity> {
        const { info, url } = createServiceDto

        const { name, description } = info

        const service = new ServiceEntity()
        service.name = name
        service.description = description
        service.url = url

        const serviceMap = await this._serviceMapService.addServiceMap(service)

        const actions = await this._actionsService.addActions(
            {
                info,
                service,
                actions: serviceMap.actions,
            },
            false,
        )
        const entities: BaseEntity[] = [service, ...actions, serviceMap]

        const queryRunner = getConnection().createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            await queryRunner.manager.save(entities)

            await queryRunner.commitTransaction()
        } catch (error) {
            this._logger.error(error)

            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }

        return serviceMap
    }

    async getServiceById(id: string): Promise<ServiceEntity> {
        const service = await this._servicesRepository.findOne(id)
        if (!service) {
            throw new NotFoundException(`No any service with ${id} id`)
        }

        return service
    }

    async updateService(input: UpdateServiceInput): Promise<ServiceMapEntity> {
        const { id } = input

        const service = await this.getServiceById(id)

        return this._serviceMapService.updateServiceMap(service)
    }

    async checkService(input: CheckServiceInput): Promise<ServiceMapDiffType> {
        const { id } = input

        const service = await this.getServiceById(id)

        const [
            serviceMap,
            differences,
        ] = await this._serviceMapService.checkServiceMap(service)

        return { serviceMap, diff: { service, ...differences } }
    }
}
