import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { RuleEntity } from './rule.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, In, Repository } from 'typeorm'
import { CreateRuleInput } from './graphql/inputs/create-rule.input'
import { UpdateRuleInput } from './graphql/inputs/update-rule.input'
import { RulesInput } from './graphql/inputs/rules.input'
import { ConditionsService } from 'src/conditions/conditions.service'
import { ActionsService } from 'src/actions/actions.service'
import { IPaginated } from 'src/shared/types/paginated.type'
import { queryBuilderLikeExpression } from 'src/shared/helpers/query-builder-like-expression.helper'

@Injectable()
export class RulesService {
    constructor(
        @InjectRepository(RuleEntity)
        private _rulesRepository: Repository<RuleEntity>,
        private _conditionsService: ConditionsService,
        private _actionsService: ActionsService,
    ) {}

    async getRulesByIds(ids: string[]): Promise<RuleEntity[]> {
        const rules = await this._rulesRepository.findByIds(ids)

        return rules
    }

    async getRuleById(id: string): Promise<RuleEntity> {
        const rule = await this._rulesRepository.findOne(id)

        if (!rule) {
            throw new NotFoundException(`rule with #${id} not found.`)
        }

        return rule
    }

    async createRule(createRuleInput: CreateRuleInput): Promise<RuleEntity> {
        const {
            info,
            actionIds,
            conditionIds,
            priority,
            effect,
        } = createRuleInput

        const rule = new RuleEntity()
        rule.info = info

        rule.conditions = await this._conditionsService.getConditionsByIds(
            conditionIds,
        )
        rule.actions = await this._actionsService.getActionsByIds(actionIds)

        rule.effect = effect
        rule.priority = priority

        try {
            await rule.save()
            return rule
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async updateRule(updateRuleInput: UpdateRuleInput): Promise<RuleEntity> {
        const {
            id,
            info: { description, name },
            effect,
            actionIds,
            conditionIds,
        } = updateRuleInput

        const rule = await this.getRuleById(id)
        rule.name = name
        rule.description = description ?? rule.description
        rule.effect = effect

        rule.conditions = await this._conditionsService.getConditionsByIds(
            conditionIds,
        )

        rule.actions = await this._actionsService.getActionsByIds(actionIds)

        await rule.save()

        return rule
    }

    async getRules(rulesInput: RulesInput): Promise<IPaginated<RuleEntity>> {
        const {
            filter: infoFilter,
            effect,
            actionsIds,
            conditionsIds,
            priority,
        } = rulesInput

        const { filter, infoQuery } = infoFilter
        const { limit, skip, ids } = filter

        const alias = 'rule'
        const queryBuilder = this._rulesRepository.createQueryBuilder(alias)

        const whereCondition: FindConditions<RuleEntity> = {}

        if (ids != null) {
            whereCondition.id = In(ids)
        }

        if (effect != null) {
            whereCondition.effect = effect
        }

        if (priority != null) {
            whereCondition.priority = priority
        }

        queryBuilder.where(whereCondition)

        if (infoQuery != null) {
            const fields: (keyof RuleEntity)[] = [`name`, `description`]
            const likeExpression = queryBuilderLikeExpression(
                infoQuery,
                alias,
                fields,
            )
            queryBuilder.andWhere(likeExpression)
        }

        if (actionsIds != null) {
            queryBuilder.innerJoin(
                `${alias}.actions`,
                'action',
                'action.id IN (:...actionsIds)',
                { actionsIds },
            )
        }

        if (conditionsIds != null) {
            queryBuilder.innerJoin(
                `${alias}.conditions`,
                'condition',
                'condition.id IN (:...conditionsIds)',
                { conditionsIds },
            )
        }

        const [rules, count] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return { nodes: rules, count }
    }
}
