import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    Repository,
    FindConditions,
    Brackets,
    ObjectLiteral,
    SelectQueryBuilder,
    In,
} from 'typeorm'
import { ConditionEntity } from './condition.entity'
import { ConditionsInput } from './graphql/inputs/conditions.input'
import { CreateConditionInput } from './graphql/inputs/create-condition.input'
import { UpdateConditionInput } from './graphql/inputs/update-condition.input'
import { IPaginated } from 'src/shared/types/paginated.type'
import { queryBuilderLikeExpression } from 'src/shared/helpers/query-builder-like-expression.helper'

@Injectable()
export class ConditionsService {
    constructor(
        @InjectRepository(ConditionEntity)
        private readonly _conditionsRepository: Repository<ConditionEntity>,
    ) {}

    async createCondition(
        createConditionInput: CreateConditionInput,
    ): Promise<ConditionEntity> {
        const { info, condition: reqCondition } = createConditionInput

        const condition = new ConditionEntity()
        condition.info = info
        condition.condition = reqCondition

        try {
            await condition.save()

            return condition
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async getConditionsByIds(ids: string[]): Promise<ConditionEntity[]> {
        const conditions = await this._conditionsRepository.findByIds(ids)

        return conditions
    }

    async updateCondition(
        updateConditionInput: UpdateConditionInput,
    ): Promise<ConditionEntity> {
        const {
            id,
            info: { name, description },
            condition: reqCondition,
        } = updateConditionInput

        const condition = await this._conditionsRepository.findOne(id)

        if (!condition) {
            throw new NotFoundException(`condition with #${id} not found.`)
        }

        condition.name = name
        condition.description = description ?? condition.description
        condition.condition = reqCondition

        await condition.save()

        return condition
    }

    async getConditions(
        conditionsInput: ConditionsInput,
    ): Promise<IPaginated<ConditionEntity>> {
        const { filter: infoFilter, conditionQuery, ruleId } = conditionsInput

        const { filter, infoQuery } = infoFilter
        const { ids, skip, limit } = filter

        const alias = 'condition'
        const queryBuilder = this._conditionsRepository.createQueryBuilder(
            alias,
        )

        if (conditionQuery != null) {
            throw new NotImplementedException(
                'Condition query is not implemented yet',
            )
        }

        const whereConditions: FindConditions<ConditionEntity> = {}
        if (ids != null) {
            whereConditions.id = In(ids)
        }
        queryBuilder.where(whereConditions)

        if (infoQuery != null) {
            const fields: (keyof ConditionEntity)[] = [`name`, `description`]

            const likeExpression = queryBuilderLikeExpression(
                infoQuery,
                alias,
                fields,
            )
            queryBuilder.andWhere(likeExpression)
        }

        if (ruleId != null) {
            queryBuilder.innerJoin(
                'permission.rules',
                'rules',
                'rule.id = :ruleId',
                { ruleId },
            )
        }

        const [conditions, count] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return { nodes: conditions, count }
    }
}

type QueryBuilderWhereCondition<T> = (
    where:
        | string
        | ObjectLiteral
        | Brackets
        | ObjectLiteral[]
        | ((qb: SelectQueryBuilder<T>) => string),
    parameters?: ObjectLiteral,
) => SelectQueryBuilder<T>
