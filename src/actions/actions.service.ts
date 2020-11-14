import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ActionEntity } from './action.entity'
import { ActionsInput } from './graphql/inputs/actions.input'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, In, Repository } from 'typeorm'
import { CreateActionsDto } from './dtos/create-actions.dto'
import { IPaginated } from 'src/shared/types/paginated.type'
import { queryBuilderLikeExpression } from 'src/shared/helpers/query-builder-like-expression.helper'

@Injectable()
export class ActionsService {
    constructor(
        @InjectRepository(ActionEntity)
        private readonly _actionsRepository: Repository<ActionEntity>,
    ) {}

    async getActionsByIds(ids: string[]): Promise<ActionEntity[]> {
        const actions = await this._actionsRepository.findByIds(ids)
        return actions
    }

    async addActions(
        input: CreateActionsDto,
        autosave = true,
    ): Promise<ActionEntity[]> {
        try {
            const { actions, service } = input

            const actionEntities = actions.map(actionString => {
                const actionEntity = new ActionEntity()
                actionEntity.service = service
                const [
                    serviceName,
                    objectTypeName,
                    objectName,
                    objectField,
                ] = actionString.split(':')
                actionEntity.objectTypeName = objectTypeName
                actionEntity.objectName = objectName
                actionEntity.objectField = objectField || null
                actionEntity.stringValue = actionString

                return actionEntity
            })

            if (autosave) {
                await this._actionsRepository.save(actionEntities)
            }

            return actionEntities
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async getActions(
        actionsInput: ActionsInput,
    ): Promise<IPaginated<ActionEntity>> {
        const { serviceId, query, ruleId, filter } = actionsInput
        const { ids, limit, skip } = filter

        const alias = 'action'
        const queryBuilder = this._actionsRepository.createQueryBuilder(alias)

        const whereCondition: FindConditions<ActionEntity> = {}
        if (ids != null) {
            whereCondition.id = In(ids)
        }
        queryBuilder.where(whereCondition)

        if (ruleId != null) {
            queryBuilder.innerJoin(
                `${alias}.rules`,
                'rule',
                'rule.id = :ruleId',
                { ruleId },
            )
        }

        if (serviceId != null) {
            queryBuilder.innerJoin(
                `${alias}.service`,
                'service',
                'service.id = :serviceId',
                { serviceId },
            )
        }

        if (query != null) {
            const fields: (keyof ActionEntity)[] = [
                'objectField',
                'objectName',
                'objectTypeName',
                'stringValue',
            ]
            const likeExpression = queryBuilderLikeExpression(
                query,
                alias,
                fields,
            )
            queryBuilder.andWhere(likeExpression)
        }

        const [actions, count] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return { nodes: actions, count }
    }
}
