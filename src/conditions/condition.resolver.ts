import { Args, Resolver, Mutation, Query } from '@nestjs/graphql'
import { ConditionsService } from './conditions.service'
import { CreateConditionInput } from './graphql/inputs/create-condition.input'
import {
    ConditionsType,
    ConditionType,
} from 'src/conditions/graphql/types/condition.type'
import { UpdateConditionInput } from './graphql/inputs/update-condition.input'
import { ConditionsInput } from './graphql/inputs/conditions.input'
import { ConditionEntity } from './condition.entity'

@Resolver('condition')
export class ConditionResolver {
    constructor(private _conditionService: ConditionsService) {}

    @Mutation(() => ConditionType, {
        description: '[ACL] create new condition',
    })
    async createCondition(
        @Args('input') createConditionInput: CreateConditionInput,
    ): Promise<ConditionEntity> {
        return this._conditionService.createCondition(createConditionInput)
    }

    @Mutation(() => ConditionType, {
        description: '[ACL] update existing condition',
    })
    async updateCondition(
        @Args('input') updateConditionInput: UpdateConditionInput,
    ): Promise<ConditionEntity> {
        return this._conditionService.updateCondition(updateConditionInput)
    }

    @Query(() => ConditionsType, {
        description: '[ACL] get existing conditions',
    })
    async conditions(
        @Args('input') conditionsInput: ConditionsInput,
    ): Promise<ConditionsType> {
        return this._conditionService.getConditions(conditionsInput)
    }
}
